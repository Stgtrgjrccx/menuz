import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#C84B00"))
            self.drawString(54, 755, "MENUZ")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#78716C"))
            self.drawString(95, 755, "|  Restaurant Experience & Operations Operating System")
            self.setStrokeColor(colors.HexColor("#EFE9DE"))
            self.setLineWidth(0.75)
            self.line(54, 748, 540, 748)

            # Footer
            self.line(54, 45, 540, 45)
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#78716C"))
            self.drawString(54, 32, "Confidential — For Restaurant Partners & Operators")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(540, 32, page_text)
        self.restoreState()

def generate_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY = colors.HexColor("#E85D04")
    DARK = colors.HexColor("#1C1917")
    MUTED = colors.HexColor("#57534E")
    LIGHT_BG = colors.HexColor("#FDFBF7")
    ACCENT_TEAL = colors.HexColor("#0D9488")
    ACCENT_BLUE = colors.HexColor("#1D4ED8")
    BORDER_COLOR = colors.HexColor("#E7E5E4")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=DARK,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=PRIMARY,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=DARK,
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK,
        leftIndent=15,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=DARK
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=DARK
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER & EXECUTIVE SUMMARY
    # =========================================================================
    story.append(Spacer(1, 20))
    story.append(Paragraph("MENUZ", ParagraphStyle('SuperLogo', fontName='Helvetica-Bold', fontSize=14, textColor=PRIMARY, spaceAfter=4)))
    story.append(Paragraph("The Restaurant Experience & Operations Operating System", title_style))
    story.append(Paragraph("Turn Every Table into High-Margin Orders, 5-Star Reviews & Zero-Downtime Kitchen KOTs", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=4, spaceAfter=18))

    exec_summary_text = (
        "<b>Executive Summary:</b> Menuz is an all-in-one in-restaurant dining operating system engineered "
        "to solve the three biggest profit leaks in modern restaurants: (1) lost review volume and negative public ratings, "
        "(2) kitchen order delays from brittle POS integrations, and (3) under-trained staff unable to articulate chef backstories "
        "and signature pairings. Menuz combines a frictionless, zero-app diner interface, a personalized AI Concierge trained directly "
        "by the head chef & owner, and a triple-redundant KOT dispatch engine that connects to any kitchen in minutes."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 10))

    # Key Value Props Table
    props_data = [
        [
            Paragraph("<b>Core Pillar</b>", table_header_style),
            Paragraph("<b>The Problem It Solves</b>", table_header_style),
            Paragraph("<b>Menuz Solution & Impact</b>", table_header_style)
        ],
        [
            Paragraph("<b>Chef & Owner AI Concierge</b>", table_body_style),
            Paragraph("Diners ask basic questions to busy waiters; miss out on signature pairings, true spice levels & allergen info.", table_body_style),
            Paragraph("A bespoke conversational AI trained on the chef's culinary lore, spice calibration (1-5) and pairings — boosting high-margin basket size by 18-24%.", table_body_style)
        ],
        [
            Paragraph("<b>Triple-Redundant KOT Engine</b>", table_body_style),
            Paragraph("Fragile cloud-only POS systems drop orders when Wi-Fi fluctuates, causing kitchen chaos and lost billing.", table_body_style),
            Paragraph("Instant multi-channel failover: Cloud POS APIs (Petpooja/Recaho/RanceLab) + Local LAN Sockets (Port 9100) + Direct WebUSB ESC/POS hardware printing.", table_body_style)
        ],
        [
            Paragraph("<b>AI Review Booster & Floor Shield</b>", table_body_style),
            Paragraph("Happy guests leave without rating; 1 upset diner posts a permanent 1-star Google review.", table_body_style),
            Paragraph("Verified 5-star Google review funnel with gamified rewards, paired with an instant manager red-alert shield for sub-4 star feedback.", table_body_style)
        ],
        [
            Paragraph("<b>Manager Hub & Live KDS</b>", table_body_style),
            Paragraph("Managing stock (86-ing) and kitchen dispatch requires expensive proprietary hardware.", table_body_style),
            Paragraph("Real-time browser-based operations console running on any tablet, phone, or billing PC with zero installation.", table_body_style)
        ]
    ]

    t_props = Table(props_data, colWidths=[1.4*inch, 2.5*inch, 2.8*inch])
    t_props.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TEXTCOLOR', (0, 0), (-1, -1), DARK),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_props)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: WHAT EXACTLY IS MENUZ? COMPLETE ARCHITECTURE & ENGINE
    # =========================================================================
    story.append(Paragraph("Chapter 1: What Exactly is Menuz?", h1_style))
    story.append(Paragraph("A Deep-Dive into the Five Core Layers of Menuz", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph("Menuz is not just a digital menu. It is an end-to-end guest experience and kitchen operations bridge operating across five integrated modules:", body_style))
    story.append(Spacer(1, 4))

    modules = [
        ("1. Diner Touchpoint & Interactive Menu", 
         "Diners access the rich, responsive web application without downloading any apps or logging into accounts. "
         "Features high-resolution authentic food photography, interactive dish customization (spice, add-ons, dietary filters), "
         "instant table waiter calling, and real-time order tracking."),
        
        ("2. Chef & Owner Personalized AI Concierge", 
         "Each restaurant receives its own distinct, fine-tuned AI dining assistant. The AI speaks in the authentic voice "
         "of the executive chef and owner, explaining preparation techniques, secret family recipes, precise spice levels (1-5), "
         "allergen precautions, and sommelier beverage pairings. It turns passive browsing into active high-ticket orders."),
        
        ("3. Triple-Redundant Universal KOT Dispatcher", 
         "Orders placed on tables are instantly converted into industry-standard ESC/POS thermal kitchen tickets and sent through 3 simultaneous redundant pipelines: "
         "Cloud REST APIs (Petpooja, Recaho, RanceLab), Local Area Network raw TCP sockets (RoyalPOS port 8080/9100), and Direct Hardware WebUSB/Serial printing. "
         "If the restaurant's internet drops, local printing continues seamlessly with zero lost tickets."),

        ("4. Gamified Review Booster & Private Floor Shield", 
         "At the end of the meal, guests are invited to participate in a gamified review experience. "
         "5-Star ratings are routed to the restaurant's verified Google Maps listing via an intelligent anti-fraud verification gate. "
         "Sub-4 star ratings trigger an immediate private red-alert to the restaurant manager's console, allowing staff to resolve concerns tableside before the customer departs."),

        ("5. Manager Operations Console & Kitchen Display System (KDS)", 
         "A unified management hub enabling instant dish 86-ing (marking out-of-stock items), real-time catalog editing, "
         "thermal printer test spooling, multi-channel POS configuration, and live table order fulfillment.")
    ]

    for title, desc in modules:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(desc, bullet_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Zero-Downtime Multi-POS Architecture", h2_style))
    
    pos_summary = (
        "<b>Supported Integrations:</b><br/>"
        "• <b>Petpooja POS:</b> Full cloud REST bridge with menu sync, custom add-on mapping, and automatic KOT printing.<br/>"
        "• <b>RoyalPOS:</b> Local Wi-Fi socket bridge (Port 8080) with zero internet dependence.<br/>"
        "• <b>Recaho:</b> Cloud kitchen API bridge with instant ticket generation across multi-outlet chains.<br/>"
        "• <b>RanceLab:</b> Enterprise ERP billing suite integration with automated GST slab calculations and inventory deduction.<br/>"
        "• <b>Direct WebUSB / Serial ESC-POS:</b> 1-click driverless printing to any 80mm thermal hardware printer."
    )
    story.append(Paragraph(pos_summary, body_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: THE CHEF & OWNER ONBOARDING QUESTIONNAIRE
    # =========================================================================
    story.append(Paragraph("Chapter 2: Chef & Owner AI Intake Questionnaire", h1_style))
    story.append(Paragraph("Ready-to-Fill Intake Document for Restaurant Owners & Head Chefs", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "<i>Give this questionnaire to the restaurant owner and executive head chef during onboarding. "
        "The responses are fed directly into the restaurant's Menuz AI engine to personalize the conversational dining concierge.</i>",
        callout_style
    ))
    story.append(Spacer(1, 10))

    q_data = [
        [
            Paragraph("<b>Intake Field</b>", table_header_style),
            Paragraph("<b>Question for Owner & Chef</b>", table_header_style),
            Paragraph("<b>Example / Notes</b>", table_header_style)
        ],
        [
            Paragraph("<b>1. Head Chef Profile</b>", table_body_style),
            Paragraph("What is the Head Chef's full name, title, culinary training background, and years of master experience?", table_body_style),
            Paragraph("e.g. Chef Sanjay Rawat, 22 years specializing in Awadhi Dum Pukht and copper deg cooking.", table_body_style)
        ],
        [
            Paragraph("<b>2. Culinary Philosophy</b>", table_body_style),
            Paragraph("What is your core kitchen standard? (e.g. hand-pounded spices, 24-hr braising, cold-pressed oils, no food colors)", table_body_style),
            Paragraph("e.g. We slow-roast whole Kashmiri chilies over charcoal and never use commercial bases.", table_body_style)
        ],
        [
            Paragraph("<b>3. Owner Lore & Voice</b>", table_body_style),
            Paragraph("Who is the founder/owner? What is the welcome message & tone? (Warm traditional, cozy bistro, or fine dining sommelier)", table_body_style),
            Paragraph("e.g. Vikramaditya Singhania — 'At Saffron House, our guests are treated as royal patrons.'", table_body_style)
        ],
        [
            Paragraph("<b>4. Spice Calibration (1-5)</b>", table_body_style),
            Paragraph("How should the AI describe your spice scale to diners?", table_body_style),
            Paragraph("e.g. 1 = Mild aromatic; 3 = Authentic North Indian warmth; 5 = Fiery Guntur chili heat.", table_body_style)
        ],
        [
            Paragraph("<b>5. Secret Dish Backstories</b>", table_body_style),
            Paragraph("List 3-5 signature dishes and their heirloom origin, preparation secrets, or special ingredients.", table_body_style),
            Paragraph("e.g. Dal Makhani simmers for 36 hours over glowing tandoor charcoal embers with churned dairy butter.", table_body_style)
        ],
        [
            Paragraph("<b>6. Signature Pairings</b>", table_body_style),
            Paragraph("Which beverages or wines do the chef & owner recommend with your top 3 main courses, and why?", table_body_style),
            Paragraph("e.g. Old Delhi Butter Chicken paired with Smoked Saffron Lassi to cut through rich makkhan.", table_body_style)
        ],
        [
            Paragraph("<b>7. Dietary & Allergen Protocols</b>", table_body_style),
            Paragraph("What are your kitchen protocols for vegetarian separation, gluten-free prep, and nut allergy isolation?", table_body_style),
            Paragraph("e.g. 100% separate fryers and cookware for vegetarian dishes; explicit KOT allergy tags.", table_body_style)
        ]
    ]

    t_q = Table(q_data, colWidths=[1.5*inch, 2.7*inch, 2.5*inch])
    t_q.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_TEAL),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_q)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: DINER EXPERIENCE & GOOGLE REVIEW FUNNEL
    # =========================================================================
    story.append(Paragraph("Chapter 3: The Gamified Review Booster & Floor Shield", h1_style))
    story.append(Paragraph("How Menuz Accelerates 5-Star Reviews While Eliminating Negative Feedback", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph(
        "Online reviews dictate restaurant discovery. A 0.5-star rating increase on Google Maps translates to a "
        "<b>19% to 27% increase in walk-in footfall</b> during peak dining hours. Menuz turns every satisfied diner into a verified reviewer.",
        body_style
    ))
    story.append(Spacer(1, 6))

    steps_data = [
        [
            Paragraph("<b>Step</b>", table_header_style),
            Paragraph("<b>Customer Experience Flow</b>", table_header_style),
            Paragraph("<b>Restaurant Benefit</b>", table_header_style)
        ],
        [
            Paragraph("<b>1. Post-Meal Prompt</b>", table_body_style),
            Paragraph("Diner finishes meal and taps 'Claim Chef Dessert / Reward' on their table screen.", table_body_style),
            Paragraph("Captures diner attention when satisfaction is at its peak.", table_body_style)
        ],
        [
            Paragraph("<b>2. Rating Gate</b>", table_body_style),
            Paragraph("Guest selects star rating (1 to 5 stars) and selects quick highlight tags (Food Quality, Ambiance, Service).", table_body_style),
            Paragraph("Instantly segments happy diners from unhappy diners.", table_body_style)
        ],
        [
            Paragraph("<b>3A. If 5 Stars (Boost)</b>", table_body_style),
            Paragraph("AI crafts a personalized review draft based on their ordered dishes. Guest copies and pastes to Google Maps in 1 click.", table_body_style),
            Paragraph("High keyword density (dish names, ambiance) boosts local SEO and Google Maps ranking.", table_body_style)
        ],
        [
            Paragraph("<b>3B. If &lt;4 Stars (Shield)</b>", table_body_style),
            Paragraph("Review is kept strictly private. An instant High-Priority Alert flashes red on the Manager Console.", table_body_style),
            Paragraph("Prevents public negative reviews by enabling managers to fix complaints before the bill is paid.", table_body_style)
        ],
        [
            Paragraph("<b>4. Anti-Fraud Reward</b>", table_body_style),
            Paragraph("Guest receives reward voucher (e.g. complimentary dessert) secured by a 15-minute countdown timer and 4-digit staff PIN.", table_body_style),
            Paragraph("100% immune to fraud, screenshot sharing, or unauthorized reuse.", table_body_style)
        ]
    ]

    t_steps = Table(steps_data, colWidths=[1.3*inch, 3.2*inch, 2.2*inch])
    t_steps.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), ACCENT_BLUE),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_steps)

    story.append(Spacer(1, 14))
    story.append(Paragraph("Restaurateur ROI & Unit Economics", h2_style))
    story.append(Paragraph(
        "• <b>Zero Forced Bill Discounts:</b> Unlike coupon aggregators that force 20-50% margins cuts, Menuz rewards guests with high-perceived-value, low-cost complimentary items (e.g. chef dessert at ₹25 food cost).<br/>"
        "• <b>+250 to +400 New 5-Star Reviews/Month:</b> Dramatically outranks local competitors on Google Search and Maps.<br/>"
        "• <b>Zero Additional Hardware Cost:</b> Runs directly on existing Android/iOS smartphones, billing PCs, and thermal printers.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: HARDWARE, KOT MATRIX & PARTNER ONBOARDING
    # =========================================================================
    story.append(Paragraph("Chapter 4: Technical Specifications & Deployment Roadmap", h1_style))
    story.append(Paragraph("Triple Redundancy Engine & 2-Minute Onboarding Workflow", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=2, spaceAfter=12))

    story.append(Paragraph("Triple-Redundancy KOT Dispatch Engine Specifications", h2_style))

    tech_specs_data = [
        [
            Paragraph("<b>Channel</b>", table_header_style),
            Paragraph("<b>Protocol / Port</b>", table_header_style),
            Paragraph("<b>Hardware & POS Supported</b>", table_header_style),
            Paragraph("<b>Setup Time</b>", table_header_style)
        ],
        [
            Paragraph("<b>Channel 1: Cloud POS Bridge</b>", table_body_style),
            Paragraph("HTTPS REST / JSON Webhooks (Encrypted)", table_body_style),
            Paragraph("Petpooja API, Recaho Cloud API, RanceLab ERP API", table_body_style),
            Paragraph("<b>60 Seconds</b> (App Key & Rest ID)", table_body_style)
        ],
        [
            Paragraph("<b>Channel 2: Local LAN Socket</b>", table_body_style),
            Paragraph("TCP Raw Socket / Port 8080 & 9100", table_body_style),
            Paragraph("RoyalPOS Local Server, Epson JetDirect, TVS RP-3160 Network", table_body_style),
            Paragraph("<b>45 Seconds</b> (Device Local IP)", table_body_style)
        ],
        [
            Paragraph("<b>Channel 3: Direct WebUSB / Serial</b>", table_body_style),
            Paragraph("USB Bulk Transfer (Class 7) / WebUSB API", table_body_style),
            Paragraph("All 80mm & 58mm ESC/POS USB thermal receipt printers", table_body_style),
            Paragraph("<b>15 Seconds</b> (1-Click Browser Grant)", table_body_style)
        ]
    ]

    t_tech = Table(tech_specs_data, colWidths=[1.6*inch, 1.8*inch, 2.3*inch, 1.0*inch])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)

    story.append(Spacer(1, 14))
    story.append(Paragraph("Partner Restaurant 3-Step Rollout Workflow", h2_style))
    story.append(Paragraph(
        "<b>Day 1: AI Persona & Catalog Ingestion (15 Minutes)</b><br/>"
        "• Manager/Owner fills out the Chef & Owner Questionnaire.<br/>"
        "• Menuz AI auto-ingests the digital catalog, dietary tags, allergens, and signature stories.<br/><br/>"
        "<b>Day 1: KOT Dispatch Verification (2 Minutes)</b><br/>"
        "• Open the 2-Minute KOT Setup Wizard in Manager Hub.<br/>"
        "• Fire a live test ticket to verify thermal printer output and kitchen layout.<br/><br/>"
        "<b>Day 2: Live Floor Launch</b><br/>"
        "• Guests enjoy seamless ordering, AI chef recommendations, and automated 5-star Google review generation.",
        body_style
    ))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=10))
    story.append(Paragraph(
        "<b>Ready to deploy Menuz in your restaurant?</b> Contact our partner engineering team or launch your live operations hub at <b>stgtrgjrccx.github.io/menuz/#/admin</b>",
        ParagraphStyle('ContactFooter', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY, alignment=1)
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {output_path}")

if __name__ == '__main__':
    out_dir = os.path.join(os.getcwd(), 'public')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'menuz_complete_pitch_and_product_deck.pdf')
    generate_pdf(out_file)
