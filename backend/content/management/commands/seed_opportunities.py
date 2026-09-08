from django.core.management.base import BaseCommand
from content.models import Opportunity

SEED = [
    ("yyas", "YYAS", "Yale Young African Scholars: An intense academic and leadership program for high-achieving African students.", "https://africanscholars.yale.edu/", "research", "Research Program", "Yale Young African Scholars"),
    ("ala", "ALA", "African Leadership Academy: Developing leaders who will transform the future of the African continent.", "https://www.africanleadershipacademy.org/", "development", "Development Platform", "African Leadership Academy"),
    ("polygence", "Polygence", "A leading research academy connecting students with research mentors for personalized independent projects.", "https://www.polygence.org/", "research", "Research Program", "Polygence"),
    ("ccir", "CCIR", "Advanced research mentorship for ambitious high school students.", "https://ccir.smapply.org/tsk/33352364/frm/293391747/e/", "research", "Research Program", "CCIR"),
    ("hult-prize", "Hult Prize", "The world's largest student competition for social innovation and entrepreneurship.", "https://www.hultprize.org/", "competition", "Competition", "Hult Prize"),
    ("dyson", "James Dyson Award", "A global engineering and design award for student innovators.", "https://www.jamesdysonaward.org/", "competition", "Competition", "James Dyson Award"),
    ("cs50", "CS50's Intro to CS (Harvard)", "A top course for programming basics and logical thinking.", "https://www.edx.org/course/cs50s-introduction-to-computer-science", "course", "Course", "Harvard / edX"),
    ("google-pm", "Google Project Management", "A professional certificate from Google to learn project management.", "https://www.coursera.org/professional-certificates/google-project-management", "course", "Course", "Google / Coursera"),
    ("ibm-data", "IBM Data Science", "A comprehensive program from IBM for data science and analytics.", "https://www.coursera.org/professional-certificates/ibm-data-science", "course", "Course", "IBM / Coursera"),
    ("yali", "YALI", "A training and support program for young African leaders.", "https://yali.state.gov/", "development", "Development Platform", "YALI"),
    ("coursera-campus", "Coursera for Campus", "A global platform offering courses from top universities.", "https://www.coursera.org/", "development", "Development Platform", "Coursera"),
    ("hp-life", "HP LIFE", "Free training courses in business skills from HP.", "https://www.life-global.org/", "development", "Development Platform", "HP"),
    ("erasmus", "Erasmus+ Youth Exchange", "Cultural and training exchange programs funded by the EU for youth.", "https://erasmus-plus.ec.europa.eu/", "development", "Development Platform", "Erasmus+"),
        ("mitef", "MIT Enterprise Forum (MITEF)", "An annual competition supporting startups and innovation in the Arab world.", "https://mitefarab.org/", "competition", "Competition", "MITEF"),
        ("google-accelerator", "Google for Startups Accelerator", "An intensive Google program supporting technology startups.", "https://startup.google.com/accelerator/", "development", "Development Platform", "Google"),
        ("tiec", "TIEC Entrepreneurship Accelerator", "An Egyptian accelerator for innovative ideas.", "https://tiec.gov.eg/", "development", "Development Platform", "TIEC"),
        ("wolfram", "Wolfram Summer School", "A summer school focused on computation, data science, and innovation.", "https://www.wolfram.com/company/careers/opportunities/#op-628015-2025-wolfram-summer-school", "course", "Course", "Wolfram"),
        ("nc-state", "NC State Research", "A research opportunity for high school students interested in STEM.", "https://airtable.com/appfk0qmR9Gf3WPsr/pag7LItHDUWsaNemI/form", "research", "Research Program", "NC State"),
        ("horizon", "Horizon Research", "Mentorship programs cultivating student research skills.", "https://airtable.com/appVSLDvRVIOB8e97/shrKtvMuFbpIfgIC0", "research", "Research Program", "Horizon Research"),
        ("pioneer", "Pioneer Academics", "A virtual research program connecting students with university professors.", "https://apply.pioneeracademics.com/portal/apply", "research", "Research Program", "Pioneer Academics"),
        ("falling-walls", "Falling Walls Lab", "A global pitch competition for innovative ideas.", "https://falling-walls.com/lab/", "competition", "Competition", "Falling Walls"),
        ("yale-markets", "Financial Markets (Yale)", "A Yale course about financial markets and investments.", "https://www.coursera.org/learn/financial-markets-global", "course", "Course", "Yale / Coursera"),
        ("helsinki-ai", "Elements of AI (Helsinki)", "A globally recognized AI basics program for non-specialists.", "https://www.elementsofai.com/", "course", "Course", "University of Helsinki"),
        ("ms-startups", "Microsoft Learn for Startups", "Educational resources and tools for technology founders.", "https://startups.microsoft.com/", "development", "Development Platform", "Microsoft"),
        ("british-council", "British Council Free Courses", "Courses in communication, management, and business English.", "https://www.britishcouncil.org/", "course", "Course", "British Council"),
        ("ashoka", "Ashoka Changemakers", "A global network supporting social innovators worldwide.", "https://www.changemakers.com/", "competition", "Competition", "Ashoka"),
]

class Command(BaseCommand):
    help = "Seed the editable Opportunities catalog"

    def handle(self, *args, **options):
        for order, (item_id, title, description, url, category, opportunity_type, provider) in enumerate(SEED):
            Opportunity.objects.update_or_create(
                id=item_id,
                defaults={
                    "title": title,
                    "ar_title": title,
                    "description": description,
                    "ar_description": description,
                    "url": url,
                    "category": category,
                    "opportunity_type": opportunity_type,
                    "provider": provider,
                    "display_order": order,
                    "is_published": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(SEED)} opportunities."))
