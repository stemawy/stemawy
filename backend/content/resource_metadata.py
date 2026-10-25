import json
import re
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import Request, urlopen

from django.conf import settings


DRIVE_ID_PATTERN = re.compile(r"/d/([a-zA-Z0-9_-]+)")
YOUTUBE_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{11}$")
YOUTUBE_DURATION_PATTERN = re.compile(
    r"^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$"
)


def _google_drive_id(url):
    parsed = urlsplit(url)
    host = parsed.hostname or ""
    if host not in {"drive.google.com", "docs.google.com"}:
        return None

    query_id = parse_qs(parsed.query).get("id", [None])[0]
    if query_id:
        return query_id

    match = DRIVE_ID_PATTERN.search(parsed.path)
    return match.group(1) if match else None


def _youtube_id(url, configured_id):
    if configured_id and YOUTUBE_ID_PATTERN.fullmatch(configured_id):
        return configured_id

    parsed = urlsplit(url)
    host = parsed.hostname or ""
    if host == "youtu.be":
        candidate = parsed.path.strip("/").split("/", 1)[0]
    elif host in {"youtube.com", "www.youtube.com", "m.youtube.com"}:
        candidate = parse_qs(parsed.query).get("v", [None])[0]
        if not candidate:
            match = re.match(r"^/(?:embed|shorts)/([^/]+)", parsed.path)
            candidate = match.group(1) if match else None
    else:
        return None

    return candidate if candidate and YOUTUBE_ID_PATTERN.fullmatch(candidate) else None


def _request_json(base_url, params):
    request_url = f"{base_url}?{urlencode(params)}"
    request = Request(request_url, headers={"Accept": "application/json"})
    try:
        with urlopen(request, timeout=4) as response:
            return json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, OSError, ValueError):
        return {}


def _youtube_duration_seconds(value):
    match = YOUTUBE_DURATION_PATTERN.fullmatch(value or "")
    if not match:
        return None
    days, hours, minutes, seconds = match.groups()
    total = (
        int(days or 0) * 86400
        + int(hours or 0) * 3600
        + int(minutes or 0) * 60
        + float(seconds or 0)
    )
    return max(1, int(total + 0.999))


def fetch_resource_metadata(resource):
    api_key = settings.GOOGLE_API_KEY
    if not api_key:
        return {}

    video_id = _youtube_id(resource.url, resource.youtube_id)
    if resource.type == "video" and video_id:
        result = _request_json(
            "https://www.googleapis.com/youtube/v3/videos",
            {"part": "contentDetails", "id": video_id, "key": api_key},
        )
        items = result.get("items", [])
        if items:
            duration = _youtube_duration_seconds(
                items[0].get("contentDetails", {}).get("duration")
            )
            return {"duration_seconds": duration} if duration else {}

    drive_id = _google_drive_id(resource.url)
    if not drive_id:
        return {}

    result = _request_json(
        f"https://www.googleapis.com/drive/v3/files/{drive_id}",
        {
            "fields": "size,videoMediaMetadata(durationMillis)",
            "key": api_key,
        },
    )
    metadata = {}
    size = result.get("size")
    if size is not None and str(size).isdigit():
        metadata["size_bytes"] = int(size)

    duration_millis = result.get("videoMediaMetadata", {}).get("durationMillis")
    if duration_millis is not None and str(duration_millis).isdigit():
        metadata["duration_seconds"] = max(1, (int(duration_millis) + 999) // 1000)

    return metadata