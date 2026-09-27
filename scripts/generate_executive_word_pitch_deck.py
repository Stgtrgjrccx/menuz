import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class WordStyleNumberedCanvas(canvas.Canvas):
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
        # Clean Word document header & footer
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#1E293B"))
            self.drawString(54, 755, "MENUZ | Executive Product & Pitch Deck")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(558, 755, "Confidential — For Restaurant Operators & Partners")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)

        # Footer on all pages
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 32, "MENUZ OS — Triple KOT Printing • Chef & Owner Personalized AI • Review Acceleration")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()

def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Professional Word Document Color Palette
    PRIMARY_NAVY = colors.HexColor("#0F172A")
    ACCENT_BRAND = colors.HexColor("#C2410C") # Deep Warm Terracotta/Saffron
    TEXT_MAIN = colors.HexColor("#1E293B")
    TEXT_MUTED = colors.HexColor("#475569")
    BG_LIGHT_GRAY = colors.HexColor("#F8FAFC")
    BG_CARD = colors.HexColor("#F1F5F9")
    BORDER_LIGHT = colors.HexColor("#CBD5E1")
    BORDER_SUBTLE = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY_NAVY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=ACCENT_BRAND,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY_NAVY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_MAIN,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_MAIN,
        leftIndent=12,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_MAIN
    )

    table_bold_style = ParagraphStyle(
        'TableBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=PRIMARY_NAVY
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=PRIMARY_NAVY
    )

    story = []

    # ═════════════════════════════════════════════════════════════════════
    # COVER / HEADER BLOCK
    # ═════════════════════════════════════════════════════════════════════
    meta_table_data = [
        [
            Paragraph("<b>MENUZ OPERATING SYSTEM</b><br/><font size=8 color='#64748B'>Next-Gen Restaurant Hospitality, KOT Automation & AI Concierge</font>", ParagraphStyle('TopLeft', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=13)),
            Paragraph("<b>EXECUTIVE PITCH &amp; PRODUCT BRIEF</b><br/><font size=8 color='#64748B'>Date: October 2026 | Version: 2.4 (Production)</font>", ParagraphStyle('TopRight', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, alignment=2))
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[3.5*inch, 3.5*inch])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-1), 1, PRIMARY_NAVY),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("MENUZ: The Complete Restaurant Operating System", title_style))
    story.append(Paragraph("Seamless Triple KOT Printing • Chef &amp; Owner Personalized AI • 5-Star Review Growth Engine", subtitle_style))
    
    # Executive Summary Box
    exec_summary_text = (
        "<b>Executive Summary:</b> MENUZ is the high-performance digital dining platform that replaces clunky, static QR menus "
        "with an intelligent, interactive guest experience. It solves the three biggest pain points for dining venues: "
        "<b>(1) Kitchen Bottlenecks</b> through reliable 3-way KOT firing (Universal Cloud POS, Direct USB Thermal Hardware, Kitchen KDS); "
        "<b>(2) Server Capacity Limits</b> through an AI Concierge trained directly on the Chef and Owner's authentic recipes and pairings; and "
        "<b>(3) Reputation & Loyalty</b> via an automated Google Review booster and gamified food reward engine that works with <i>zero discount mandates</i>."
    )
    exec_box = Table([[Paragraph(exec_summary_text, callout_style)]], colWidths=[7.0*inch])
    exec_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(exec_box)
    story.append(Spacer(1, 12))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 1: THE CORE PROBLEM & THE MENUZ SOLUTION
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1. Market Problem vs. The Menuz Solution", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))

    problem_solution_data = [
        [
            Paragraph("Industry Bottleneck", table_header_style),
            Paragraph("Traditional Status Quo", table_header_style),
            Paragraph("The MENUZ Solution", table_header_style)
        ],
        [
            Paragraph("<b>Kitchen Order Delay</b>", table_bold_style),
            Paragraph("Waiters manually write slips or punch orders at distant POS terminals, causing 12-18 min order entry lag.", table_body_style),
            Paragraph("<b>Instant Triple KOT:</b> Orders trigger thermal kitchen printing in 200ms via WebUSB or Cloud POS bridge.", table_body_style)
        ],
        [
            Paragraph("<b>Menu Comprehension</b>", table_bold_style),
            Paragraph("Static PDF menus or generic lists fail to explain spice levels, allergens, or chef specials.", table_body_style),
            Paragraph("<b>Personalized Chef AI:</b> AI concierge trained on the Head Chef's secret spices, pairings & house lore.", table_body_style)
        ],
        [
            Paragraph("<b>Review Collection</b>", table_bold_style),
            Paragraph("Only 1-2% of happy diners leave a Google review, while unhappy diners vent publicly.", table_body_style),
            Paragraph("<b>1-Click Review Booster:</b> 35-45% review capture rate with AI feedback assistant and verified wheel spin.", table_body_style)
        ],
        [
            Paragraph("<b>Discount Fatigue</b>", table_bold_style),
            Paragraph("Aggregators force 20-40% bill discounts, destroying restaurant profit margins.", table_body_style),
            Paragraph("<b>Optional Food-Only Rewards:</b> Reward guests with chef-curated complimentary bites instead of cash discounts.", table_body_style)
        ]
    ]
    t_prob = Table(problem_solution_data, colWidths=[1.5*inch, 2.7*inch, 2.8*inch])
    t_prob.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT_GRAY]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_prob)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 2: TRIPLE KOT PRINTING & KITCHEN INTEGRATION
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2. Zero-Failure Triple KOT Printing Infrastructure", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Menuz provides <b>three simultaneous, fully independent methods</b> to route orders to kitchen staff, "
        "ensuring zero missed tickets even during peak rush hours or internet disruptions:",
        body_style
    ))

    kot_data = [
        [
            Paragraph("Method", table_header_style),
            Paragraph("Technology & Hardware", table_header_style),
            Paragraph("Key Operational Benefit", table_header_style)
        ],
        [
            Paragraph("<b>1. Universal POS Bridge</b>", table_bold_style),
            Paragraph("Petpooja, RoyalPOS, Recaho, Rancelab, POSist webhook integration.", table_body_style),
            Paragraph("Direct sync into restaurant's existing billing system without replacing existing software.", table_body_style)
        ],
        [
            Paragraph("<b>2. Direct WebUSB / Serial Hardware Printing</b>", table_bold_style),
            Paragraph("Direct binary ESC/POS protocol to Epson, TVS, Star, Xprinter thermal printers.", table_body_style),
            Paragraph("<b>Zero drivers, zero cloud dependency.</b> Prints physically on kitchen thermal printer in under 300ms.", table_body_style)
        ],
        [
            Paragraph("<b>3. Live Kitchen Display System (KDS)</b>", table_bold_style),
            Paragraph("Real-time responsive screen for kitchen tablets/screens with color-coded timers.", table_body_style),
            Paragraph("Instant audible chime, prep timer tracking (Green -> Amber -> Red urgency), and bump-bar status.", table_body_style)
        ]
    ]
    t_kot = Table(kot_data, colWidths=[1.8*inch, 2.5*inch, 2.7*inch])
    t_kot.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT_GRAY]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_kot)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 3: CHEF & OWNER PERSONALIZED AI CONCIERGE
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3. The Personalized Chef & Owner AI Concierge", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Unlike generic LLM bots, the Menuz AI Concierge is a <b>bespoke brand ambassador</b> trained on each venue's "
        "distinct culinary philosophy, head chef secrets, owner hospitality tone, and granular dish profiles.",
        body_style
    ))

    ai_features_data = [
        [
            Paragraph("Feature", table_header_style),
            Paragraph("Intake & Training Method", table_header_style),
            Paragraph("Guest Experience Impact", table_header_style)
        ],
        [
            Paragraph("<b>Chef's Favourites &amp; Specials</b>", table_bold_style),
            Paragraph("1-click tagging of Head Chef's personal favorites and house signature dishes.", table_body_style),
            Paragraph("When guests ask what to order, hero dishes are recommended with authentic chef pride.", table_body_style)
        ],
        [
            Paragraph("<b>Daily Freshness Broadcast</b>", table_bold_style),
            Paragraph("Chef's 10-second morning update (e.g. <i>'Slow-simmered Rogan Josh batch started at 4:30 AM'</i>).", table_body_style),
            Paragraph("AI highlights today's morning catch and fresh batches when greeting diners.", table_body_style)
        ],
        [
            Paragraph("<b>Dish-by-Dish Secrets</b>", table_bold_style),
            Paragraph("Curated recipe notes, secret spice origin, cooking time (e.g. 18-hr slow simmer), and authentic techniques.", table_body_style),
            Paragraph("Guests discover the craftsmanship behind high-margin dishes, driving 24% higher average order value.", table_body_style)
        ],
        [
            Paragraph("<b>Curated Beverage Pairings</b>", table_bold_style),
            Paragraph("Specific food + beverage pairings with culinary 'why' explanation (e.g., Dum Biryani + Saffron Chaas).", table_body_style),
            Paragraph("High-conversion upsells recommended naturally when guests inquire about menu choices.", table_body_style)
        ],
        [
            Paragraph("<b>Voice Styles &amp; FAQs</b>", table_bold_style),
            Paragraph("Royal Awadhi, Michelin Fine Dining, or Bistro Cozy tones + Halal/Zero MSG/elder care FAQ trainer.", table_body_style),
            Paragraph("Eliminates diner anxiety, protects guest health, and reflects authentic owner hospitality.", table_body_style)
        ],
        [
            Paragraph("<b>Fast Intake Studio</b>", table_bold_style),
            Paragraph("<b>1-Click AI Auto-Drafting, Voice Dictation, Matrix mode</b>, + Add Missing Dish, &amp; WhatsApp sharing.", table_body_style),
            Paragraph("Chefs and owners complete full 50-dish menu onboarding in under 5 minutes without friction.", table_body_style)
        ]
    ]
    t_ai = Table(ai_features_data, colWidths=[1.6*inch, 2.7*inch, 2.7*inch])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT_GRAY]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_ai)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 4: REVIEW BOOST & OPTIONAL FOOD-ONLY REWARD SYSTEM
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4. 5-Star Review Booster & Food-Only Reward Engine", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))
    
    story.append(Paragraph(
        "<b>Zero-Discount Protection:</b> Many premium restaurants refuse to discount their food. Menuz gives operators total control: "
        "configure rewards purely as <b>Complimentary Chef Tastings, Mocktails, or Artisan Desserts</b> for next visits, "
        "driving repeat dining frequency while preserving 100% of the check size.",
        body_style
    ))

    review_steps = [
        "<b>Step 1: Intelligent Review Drafting:</b> Diners select what they loved (Ambiance, Dal Makhani, Prompt Service). Menuz AI generates a polished 5-star draft ready for 1-tap Google Maps submission.",
        "<b>Step 2: Verification Gate:</b> Prevents fraudulent claims by verifying submission before unlocking the reward wheel.",
        "<b>Step 3: Gamified Spin-to-Win:</b> Exciting visual wheel gives instant gratification with customized restaurant rewards.",
        "<b>Step 4: Unique Cryptographic Voucher:</b> Issues a scannable token redeemable on the guest's next visit, boosting 30-day retention by up to 38%."
    ]
    for step in review_steps:
        story.append(Paragraph(f"• {step}", bullet_style))
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 5: OPERATIONAL & FINANCIAL ROI FOR OPERATORS
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5. Measurable Financial ROI for Restaurant Partners", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))

    roi_data = [
        [
            Paragraph("Metric", table_header_style),
            Paragraph("Before Menuz", table_header_style),
            Paragraph("With Menuz OS", table_header_style),
            Paragraph("Direct Impact", table_header_style)
        ],
        [
            Paragraph("<b>Table Turnaround</b>", table_bold_style),
            Paragraph("65 - 80 min / table", table_body_style),
            Paragraph("<b>48 - 55 min / table</b>", table_bold_style),
            Paragraph("+22% more table turns during peak rush", table_body_style)
        ],
        [
            Paragraph("<b>Monthly Google Reviews</b>", table_bold_style),
            Paragraph("15 - 30 reviews", table_body_style),
            Paragraph("<b>250 - 450 reviews</b>", table_bold_style),
            Paragraph("Top 3 local search ranking on Google Maps", table_body_style)
        ],
        [
            Paragraph("<b>Upselling & AOV</b>", table_bold_style),
            Paragraph("₹850 / cover", table_body_style),
            Paragraph("<b>₹1,050 / cover</b>", table_bold_style),
            Paragraph("+23.5% higher average check value", table_body_style)
        ],
        [
            Paragraph("<b>Staff Overhead Stress</b>", table_bold_style),
            Paragraph("High rush confusion", table_body_style),
            Paragraph("<b>Smooth automation</b>", table_bold_style),
            Paragraph("Waiters focus on hospitality rather than order entry", table_body_style)
        ]
    ]
    t_roi = Table(roi_data, colWidths=[1.5*inch, 1.5*inch, 1.6*inch, 2.4*inch])
    t_roi.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT_GRAY]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_roi)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 6: 5-MINUTE ONBOARDING & CONTACT
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("6. Fast 5-Minute Setup & Deployment", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))

    deployment_data = [
        [
            Paragraph("Phase", table_header_style),
            Paragraph("Action Required", table_header_style),
            Paragraph("Duration", table_header_style)
        ],
        [
            Paragraph("<b>1. Menu Upload</b>", table_bold_style),
            Paragraph("Import existing POS menu or use 269+ pre-indexed Pune restaurant catalog.", table_body_style),
            Paragraph("<b>60 seconds</b>", table_bold_style)
        ],
        [
            Paragraph("<b>2. AI Intake Questionnaire</b>", table_bold_style),
            Paragraph("Use 1-Click Auto-Drafting, voice dictation, or share intake form via WhatsApp/PDF.", table_body_style),
            Paragraph("<b>3 minutes</b>", table_bold_style)
        ],
        [
            Paragraph("<b>3. KOT Hardware Pairing</b>", table_bold_style),
            Paragraph("Plug USB thermal printer or connect Cloud POS webhook token.", table_body_style),
            Paragraph("<b>60 seconds</b>", table_bold_style)
        ],
        [
            Paragraph("<b>4. Go Live</b>", table_bold_style),
            Paragraph("Place table QR acrylics or smart NFC pucks. Instant guest ordering active.", table_body_style),
            Paragraph("<b>Instant</b>", table_bold_style)
        ]
    ]
    t_dep = Table(deployment_data, colWidths=[1.8*inch, 3.8*inch, 1.4*inch])
    t_dep.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT_GRAY]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_dep)
    story.append(Spacer(1, 14))

    # ═════════════════════════════════════════════════════════════════════
    # SECTION 7: ADVANCED STRATEGIC OPERATIONS & EXPERIENCE ENGINE
    # ═════════════════════════════════════════════════════════════════════
    story.append(Paragraph("7. Advanced Strategic Operations & Experience Suite", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_LIGHT, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Menuz continuously expands with high-impact features requested by premier restaurant partners:",
        body_style
    ))

    strategic_features_data = [
        [
            Paragraph("Innovation", table_header_style),
            Paragraph("Capability & Technical Architecture", table_header_style),
            Paragraph("Restaurant Operator Benefit", table_header_style)
        ],
        [
            Paragraph("<b>Multiplayer Table Cart Sync</b>", table_bold_style),
            Paragraph("Real-time live multi-diner synchronization. Guests at Table X browse and add items simultaneously with individual guest tags.", table_body_style),
            Paragraph("Eliminates fragmented orders, speeds up group dining decisions, and lifts table spend by 22%.", table_body_style)
        ],
        [
            Paragraph("<b>1-Tap Waiter Calls &amp; Service SOS</b>", table_bold_style),
            Paragraph("Diners summon waitstaff with 1 tap: 'Call Waiter', 'Water Needed', 'Clean Table', or 'Bill Requested' with real-time floor alerts.", table_body_style),
            Paragraph("Eliminates frantic waving and cuts diner wait times from 10 minutes to under 60 seconds.", table_body_style)
        ],
        [
            Paragraph("<b>Owner-Controlled Reward Gateway</b>", table_bold_style),
            Paragraph("Owner chooses whether diners unlock table rewards via <b>5-Star Google Reviews</b>, <b>9:16 Instagram Stories</b>, or <b>Dual Mode</b>.", table_body_style),
            Paragraph("Operators direct customer actions toward either local Google Maps SEO or viral peer-to-peer social media reach.", table_body_style)
        ],
        [
            Paragraph("<b>Direct Kitchen KOT (Owner-Controlled)</b>", table_bold_style),
            Paragraph("Orders can bypass floor approval to print directly at kitchen line (ESC/POS, Petpooja, Recaho). <b>Completely optional</b> — owner toggles between Mode A (auto-dispatch) or Mode B (captain review).", table_body_style),
            Paragraph("Cuts peak-hour order lag from 12 minutes to 0 seconds, or keeps traditional captain curation for fine dining.", table_body_style)
        ],
        [
            Paragraph("<b>Chef's Recommended Pairings</b>", table_bold_style),
            Paragraph("Algorithmic wine, cocktail, and side recommendations with configurable bundle discounts (e.g. 10-20% off) and 1-click cart add.", table_body_style),
            Paragraph("Automates high-margin sommelier upselling on every single table without relying on waiter memory.", table_body_style)
        ],
        [
            Paragraph("<b>AI Sommelier Auto-Scroll UX</b>", table_bold_style),
            Paragraph("Chat window automatically scrolls down to the newest reply upon tapping suggestion chips. Calibrated 1-5 spice benchmarks.", table_body_style),
            Paragraph("Frictionless conversation where guests never need to scroll down manually to read recommendations.", table_body_style)
        ],
        [
            Paragraph("<b>Viral 9:16 Instagram Story Cards</b>", table_bold_style),
            Paragraph("Generates 9:16 vertical aesthetic social story cards with authentic food photography, restaurant branding, and review stickers.", table_body_style),
            Paragraph("Free organic word-of-mouth marketing as satisfied diners share dish stories directly to Instagram & WhatsApp.", table_body_style)
        ],
        [
            Paragraph("<b>Multi-Restaurant Image Library & Persistence</b>", table_bold_style),
            Paragraph("Master image library partitioned per restaurant listing. Persistent multi-tenant storage ensures onboarded venues never disappear on reload.", table_body_style),
            Paragraph("Clean media organization and standalone independent restaurant websites (/r/:slug).", table_body_style)
        ],
        [
            Paragraph("<b>Direct Restaurant Access Onboarding</b>", table_bold_style),
            Paragraph("Removed arbitrary 7-day trial limits. Platform owner directly grants instant, full-featured access with flat ₹1,999/mo and 0% food cut.", table_body_style),
            Paragraph("Zero friction onboarding and full administrative autonomy for restaurant partners.", table_body_style)
        ],
        [
            Paragraph("<b>Multilingual Regional Support</b>", table_bold_style),
            Paragraph("<b>English strictly primary default on open.</b> Physical 1-click toggles for <b>Hindi (हिन्दी)</b> and <b>Marathi (मराठी)</b> across categories, search, and notes.", table_body_style),
            Paragraph("Honors regional Maharashtrian & Pan-Indian diners without confusing international guests or relying on faulty auto-translate.", table_body_style)
        ]
    ]
    t_strat = Table(strategic_features_data, colWidths=[1.8*inch, 2.7*inch, 2.5*inch])
    t_strat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY_NAVY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT_GRAY]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(t_strat)
    story.append(Spacer(1, 14))

    # Contact & Next Steps Box
    contact_box_text = (
        "<b>Ready to Supercharge Your Restaurant Operations?</b><br/>"
        "Schedule a live on-site demo or test Menuz in your kitchen today.<br/>"
        "<b>Website:</b> menuz.app &nbsp;|&nbsp; <b>Partner Support:</b> partner@menuz.app &nbsp;|&nbsp; <b>Live Demo Hub:</b> menuz.app/#/admin"
    )
    contact_box = Table([[Paragraph(contact_box_text, callout_style)]], colWidths=[7.0*inch])
    contact_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93C5FD")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(contact_box)

    doc.build(story, canvasmaker=WordStyleNumberedCanvas)
    print(f"Successfully generated clean Word-style pitch deck PDF at: {output_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, 'public')
    os.makedirs(public_dir, exist_ok=True)
    
    out1 = os.path.join(public_dir, 'menuz_executive_pitch_deck.pdf')
    out2 = os.path.join(public_dir, 'menuz_complete_pitch_and_product_deck.pdf')
    
    build_pdf(out1)
    build_pdf(out2)
