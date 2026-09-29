import os
import sys
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas

# Exact 16:9 Widescreen slide dimensions in points (13.333 x 7.5 inches = 960 x 540 pt)
SLIDE_WIDTH = 13.333 * 72   # 960 pt
SLIDE_HEIGHT = 7.5 * 72     # 540 pt

def draw_slide_decorations(canvas, doc):
    canvas.saveState()
    # Draw Midnight Obsidian Background for entire slide BEHIND all flowables
    canvas.setFillColor(colors.HexColor("#090D16"))
    canvas.rect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, fill=1, stroke=0)

    # Bottom footer line and slide indicator
    canvas.setFont("Helvetica-Bold", 9)
    canvas.setFillColor(colors.HexColor("#F59E0B"))
    canvas.drawString(50, 18, "MENUZ")
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#94A3B8"))
    canvas.drawString(100, 18, "|   The Autonomous Dining OS & Decoupled Reputation Engine")
    
    slide_text = f"Slide {doc.page} of 19"
    canvas.drawRightString(SLIDE_WIDTH - 50, 18, slide_text)
    
    # Subtle glowing neon bottom line
    canvas.setStrokeColor(colors.HexColor("#27364F"))
    canvas.setLineWidth(1)
    canvas.line(50, 30, SLIDE_WIDTH - 50, 30)
    canvas.restoreState()

def generate_landscape_slide_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=(SLIDE_WIDTH, SLIDE_HEIGHT),
        leftMargin=50,
        rightMargin=50,
        topMargin=32,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Brand Colors
    c_gold = colors.HexColor("#F59E0B")
    c_cyan = colors.HexColor("#06B6D4")
    c_emerald = colors.HexColor("#10B981")
    c_rose = colors.HexColor("#F43F5E")
    c_violet = colors.HexColor("#8B5CF6")
    c_card_bg = colors.HexColor("#131C2E")
    c_card_alt = colors.HexColor("#18243B")
    c_border = colors.HexColor("#27364F")
    c_border_cyan = colors.HexColor("#0891B2")
    c_border_gold = colors.HexColor("#D97706")
    c_text_white = colors.HexColor("#FAFAFA")
    c_text_sub = colors.HexColor("#CBD5E1")
    c_text_muted = colors.HexColor("#94A3B8")

    # Typography Styles for Large 16:9 Slides
    tag_cyan = ParagraphStyle(
        'TagCyan',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_cyan,
        spaceAfter=2
    )
    tag_gold = ParagraphStyle(
        'TagGold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_gold,
        spaceAfter=2
    )
    tag_rose = ParagraphStyle(
        'TagRose',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_rose,
        spaceAfter=2
    )
    tag_emerald = ParagraphStyle(
        'TagEmerald',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_emerald,
        spaceAfter=2
    )

    title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=25,
        leading=29,
        textColor=c_text_white,
        spaceAfter=4
    )
    sub_style = ParagraphStyle(
        'SlideSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=17,
        textColor=c_text_sub,
        spaceAfter=12
    )

    card_h_gold = ParagraphStyle(
        'CardHGold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_gold,
        spaceAfter=4
    )
    card_h_cyan = ParagraphStyle(
        'CardHCyan',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_cyan,
        spaceAfter=4
    )
    card_h_emerald = ParagraphStyle(
        'CardHEmerald',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_emerald,
        spaceAfter=4
    )
    card_h_rose = ParagraphStyle(
        'CardHRose',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_rose,
        spaceAfter=4
    )

    card_body = ParagraphStyle(
        'CardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16.5,
        textColor=c_text_sub,
        spaceAfter=4
    )

    story = []

    # =========================================================================
    # SLIDE 1: COVER SLIDE (16:9 MIDNIGHT LUXURY)
    # =========================================================================
    s1_content = [
        [
            Paragraph("<b>MENUZ</b>", ParagraphStyle('CoverHuge', fontName='Helvetica-Bold', fontSize=48, leading=52, textColor=c_text_white)),
        ],
        [
            Paragraph("The Modern Dine-In Operating System & Growth Engine", ParagraphStyle('CoverSub', fontName='Helvetica-Bold', fontSize=22, leading=26, textColor=c_gold)),
        ],
        [
            Paragraph(
                "⚡  <b>Interactive HD Menus & Real-Time Multiplayer Sync (<100ms):</b> Co-ordering with zero app downloads.<br/>"
                "⚡  <b>Chef & Owner AI Sommelier:</b> Margin-focused drink & pairing upsells (+22% average check size).<br/>"
                "⚡  <b>Reputation Floor Shield:</b> Multiplies 5★ Google reviews while intercepting 1-3★ issues in <60s table-side.<br/>"
                "⚡  <b>Direct Kitchen KOT & POS Integration:</b> Mode A (1-sec direct) or Mode B (Captain review); syncs with Petpooja.<br/>"
                "⚡  <b>Commercial Model:</b> Flat ₹1,999/mo, 0% commission, and 100% customer WhatsApp data ownership.",
                ParagraphStyle('CoverBullets', fontName='Helvetica', fontSize=13, leading=20, textColor=c_text_sub)
            )
        ],
        [
            Paragraph("MASTER RESTAURANT PARTNERSHIP DECK • 15 RESTAURANT VALIDATION EDITION • MENUZ PLATFORM", ParagraphStyle('CoverFoot', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=c_text_muted))
        ]
    ]
    t_s1 = Table(s1_content, colWidths=[SLIDE_WIDTH - 100])
    t_s1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 2, c_gold),
        ('PADDING', (0,0), (-1,-1), 22),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_s1)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 2: THE MODERN DINE-IN CRISIS
    # =========================================================================
    story.append(Paragraph("// INDUSTRY CHALLENGE", tag_rose))
    story.append(Paragraph("The 4 Critical Operational Traps Bleeding Restaurant Profits", title_style))
    story.append(Paragraph("Why traditional paper menus, delivery aggregators, and unmanaged public reviews harm dining revenue.", sub_style))

    p1 = [
        Paragraph("1. Aggregator Trap (25-30% Cut)", card_h_rose),
        Paragraph("Delivery platforms charge crippling commissions and withhold diner phone numbers. Restaurants do all the cooking while aggregators own the diner relationship.", card_body)
    ]
    p2 = [
        Paragraph("2. Paper Menu Blindness", card_h_gold),
        Paragraph("Static paper menus fail to upsell drinks or show plating. Updating single dish prices requires expensive re-printing and days of delay.", card_body)
    ]
    p3 = [
        Paragraph("3. The 1-Star Google Ambush", card_h_rose),
        Paragraph("Diners leave quietly without complaining to staff, then post devastating 1-star Google reviews from home at 11 PM, permanently lowering your SEO rank.", card_body)
    ]
    p4 = [
        Paragraph("4. Waiter Dispatch Bottlenecks", card_h_cyan),
        Paragraph("Guests wave hands frantically for water or bills during peak rush. Table turnover slows by 15-20 minutes, costing thousands in lost seatings.", card_body)
    ]

    t_s2 = Table([[p1, p2], [p3, p4]], colWidths=[(SLIDE_WIDTH - 110)/2, (SLIDE_WIDTH - 110)/2])
    t_s2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s2)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3: FACTUAL MARKETING MATRIX
    # =========================================================================
    story.append(Paragraph("// FACTUAL MARKETING MATRIX", tag_cyan))
    story.append(Paragraph("Public Google Reviews vs. Instagram UGC vs. Private Floor Shield", title_style))
    story.append(Paragraph("Demystifying reviews: Google Search SEO vs. Social Media Virality vs. Table Damage Control.", sub_style))

    c3_a = [
        Paragraph("A. Public Google Reviews", card_h_gold),
        Paragraph("<b>Platform:</b> Google Maps / Local 3-Pack<br/>"
                  "<b>Format:</b> Permanent star score + text review.<br/>"
                  "<b>Impact:</b> Dictates organic ranking for search ('best cafe near me') and walk-in footfall.<br/>"
                  "<b>Menuz Role:</b> Multiplies 5★ reviews via 1-tap AI drafts and gamified Lucky Wheel rewards.", card_body)
    ]
    c3_b = [
        Paragraph("B. Instagram / Social UGC", card_h_rose),
        Paragraph("<b>Platform:</b> Instagram Stories & Reels<br/>"
                  "<b>Format:</b> 9:16 Vertical branded dish cards.<br/>"
                  "<b>Impact:</b> Reaches 500–2,000 local friends of the guest, creating visual FOMO and buzz.<br/>"
                  "<b>Menuz Role:</b> Auto-generates branded 9:16 story cards with @restaurant tag in 1 tap.", card_body)
    ]
    c3_c = [
        Paragraph("C. Private Floor Shield", card_h_emerald),
        Paragraph("<b>Platform:</b> Internal Manager Tablet / SMS<br/>"
                  "<b>Format:</b> Private 1-3★ table grievance alert.<br/>"
                  "<b>Impact:</b> Stops complaints from reaching Google; alerts floor manager in <60s.<br/>"
                  "<b>Menuz Role:</b> Manager resolves issue at table before guest ever leaves.", card_body)
    ]

    t_s3 = Table([[c3_a, c3_b, c3_c]], colWidths=[(SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3])
    t_s3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s3)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4: VISUAL DIGITAL MENU & SERVICE CONTROLS
    # =========================================================================
    story.append(Paragraph("// DINER TABLE INTERFACE", tag_cyan))
    story.append(Paragraph("Visual Digital Menu: Engaging Appetites with Culinary Storytelling", title_style))
    story.append(Paragraph("Replacing paper text with high-res plating photos, calibrated spice meters, and instant service calls.", sub_style))

    c4_left = [
        Paragraph("Visual Menu Architecture", card_h_cyan),
        Paragraph("• <b>High-Res Plating Photos:</b> Triggers visual appetite stimulation and higher check size.<br/>"
                  "• <b>Spice Meters (Levels 1 to 5):</b> Prevents spice mismatches (Level 1: Cashew Cream, Level 5: Guntur Chili).<br/>"
                  "• <b>Dietary & Allergen Filtering:</b> Instant 1-tap filtering for Pure Veg (🟢), Non-Veg (🔴), Vegan, Jain, and Gluten-Free.<br/>"
                  "• <b>Chef's Secret Lore:</b> Highlights slow-braising and charcoal tandoor heritage.", card_body)
    ]
    c4_right = [
        Paragraph("Zero-Friction Service Controls", card_h_gold),
        Paragraph("• <b>Zero App Downloads:</b> Runs instantly in Safari/Chrome via lightweight PWA.<br/>"
                  "• <b>1-Tap Floor Service SOS:</b> Diners tap 'Call Waiter', 'Water', or 'Bill' — staff tablet buzzes instantly.<br/>"
                  "• <b>Live Kitchen Preparation Tracking:</b> Diners see 'Received' → 'Preparing' → 'Served'.<br/>"
                  "• <b>Instant Itemized Bill View:</b> Transparent checkout cuts wait times by 80%.", card_body)
    ]

    t_s4 = Table([[c4_left, c4_right]], colWidths=[(SLIDE_WIDTH - 110)/2, (SLIDE_WIDTH - 110)/2])
    t_s4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border_cyan),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s4)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5: REAL-TIME MULTIPLAYER TABLE SYNC
    # =========================================================================
    story.append(Paragraph("// GROUP DINING INNOVATION", tag_cyan))
    story.append(Paragraph("Real-Time Multiplayer Table Sync: Group Dining Reimagined", title_style))
    story.append(Paragraph("Multiple phones at the same table add dishes together into one synchronized live cart.", sub_style))

    c5_1 = [
        Paragraph("Live Shared Tray (<100ms)", card_h_cyan),
        Paragraph("All guests at Table 4 connect to the same real-time WebSocket room. When Rohan adds Butter Naan, Priya sees it on her screen in milliseconds.", card_body)
    ]
    c5_2 = [
        Paragraph("Guest Attribution Tags", card_h_gold),
        Paragraph("Every item displays who ordered it ('👤 Rohan', '👤 Priya'), eliminating the awkward confusion of duplicate orders.", card_body)
    ]
    c5_3 = [
        Paragraph("Harmonious Kitchen KOT", card_h_emerald),
        Paragraph("The table reviews the unified cart together before dispatching, ensuring the kitchen receives one organized ticket.", card_body)
    ]

    t_s5 = Table([[c5_1, c5_2, c5_3]], colWidths=[(SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3])
    t_s5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s5)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 6: CHEF & OWNER-TRAINED AI SOMMELIER
    # =========================================================================
    story.append(Paragraph("// AI DINING CONCIERGE", tag_gold))
    story.append(Paragraph("Chef AI Sommelier: Always Guiding Choices & Answering Questions", title_style))
    story.append(Paragraph("A conversational AI trained directly on your chef's recipes and owner's upsell rules.", sub_style))

    c6_content = [
        Paragraph("How the In-Menu AI Concierge Drives Higher Check Sizes", card_h_gold),
        Paragraph(
            "• <b>Trained on Head Chef's Recipes:</b> Speaks with authentic culinary authority on marinades, braising times, and heat levels with zero hallucinations.<br/>"
            "• <b>Trained on Owner's Upsell Playbook:</b> When asked what goes with Biryani, the AI naturally recommends high-margin coolers, specialty naans, and house desserts.<br/>"
            "• <b>Smart Auto-Scroll UX & Suggestion Chips:</b> Diners tap quick chips ('Pair a drink with Paneer Tikka', 'Is Mutton Curry spicy?'). The chat window smoothly auto-scrolls without typing.<br/>"
            "• <b>Dietary & Allergen Guarantee:</b> Instantly verifies kitchen protocols for Jain, nut-free, vegan, and gluten-free items with 100% confidence.",
            card_body
        )
    ]
    t_s6 = Table([[c6_content]], colWidths=[SLIDE_WIDTH - 100])
    t_s6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1.5, c_border_gold),
        ('PADDING', (0,0), (-1,-1), 15),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s6)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 7: CHEF PAIRINGS & REVENUE UPSELL ENGINE
    # =========================================================================
    story.append(Paragraph("// REVENUE ACCELERATION", tag_emerald))
    story.append(Paragraph("Smart Chef Pairings: Boosting Average Ticket Size by +22%", title_style))
    story.append(Paragraph("Automated contextual beverage and side bundle recommendations served right inside the cart.", sub_style))

    c7_1 = [
        Paragraph("Contextual Dish Matching", card_h_cyan),
        Paragraph("Selecting Awadhi Murgh Biryani automatically surfaces the Chef's Pairing: Garlic Butter Naan + Royal Kokum Mint Cooler with 1-tap addition.", card_body)
    ]
    c7_2 = [
        Paragraph("Curated Pairing Add-Ons", card_h_gold),
        Paragraph("Owners configure high-margin beverage and dessert pairings. Diners enjoy chef-recommended combinations while restaurants sell more appetizers and drinks without price slashing.", card_body)
    ]
    c7_3 = [
        Paragraph("1-Click In-Tray Quick Add", card_h_emerald),
        Paragraph("Suggested pairings appear inside the bottom cart sheet so diners add them instantly without browsing separate menu categories.", card_body)
    ]

    t_s7 = Table([[c7_1, c7_2, c7_3]], colWidths=[(SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3])
    t_s7.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s7)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 8: THE REPUTATION FLOOR SHIELD
    # =========================================================================
    story.append(Paragraph("// REPUTATION DEFENSE", tag_emerald))
    story.append(Paragraph("The Reputation Floor Shield: 5★ to Google, 1-3★ to Manager", title_style))
    story.append(Paragraph("How Menuz channels positive reviews to Google Maps while intercepting complaints table-side.", sub_style))

    c8_1 = [
        Paragraph("4-5★ -> Public Google Maps Multiplier", card_h_gold),
        Paragraph("Delighted diners receive AI-generated dish-specific review drafts and are deep-linked straight to your Google Maps review page in 1 tap.", card_body)
    ]
    c8_2 = [
        Paragraph("1-3★ -> Silent Manager SOS Alert", card_h_cyan),
        Paragraph("Ratings under 4 stars NEVER touch Google Maps. An urgent alert buzzes the manager's tablet: 'Table 4: Soup lukewarm'.", card_body)
    ]
    c8_3 = [
        Paragraph("Tableside Recovery in <60 Seconds", card_h_emerald),
        Paragraph("Floor manager visits Table 4 immediately with a fresh dish or personal apology, converting an upset guest before they leave.", card_body)
    ]
    c8_4 = [
        Paragraph("Permanent 4.8+ Google Rating", card_h_gold),
        Paragraph("Guarantees your public Google rating stays high, driving continuous search footfall while giving kitchen staff honest feedback.", card_body)
    ]

    t_s8 = Table([[c8_1, c8_2], [c8_3, c8_4]], colWidths=[(SLIDE_WIDTH - 110)/2, (SLIDE_WIDTH - 110)/2])
    t_s8.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s8)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 9: PUBLIC GOOGLE MAPS SEO ENGINE
    # =========================================================================
    story.append(Paragraph("// SEARCH DOMINANCE", tag_gold))
    story.append(Paragraph("Google Maps 3-Pack Dominance & AI Review Multiplication", title_style))
    story.append(Paragraph("Turn every happy dining table into a high-ranking Google SEO asset.", sub_style))

    c9_content = [
        Paragraph("How Menuz Powers Local Search Discovery on Google", card_h_gold),
        Paragraph(
            "• <b>AI Dish-Specific Review Drafts:</b> Diners hate typing reviews. Menuz creates authentic 2-sentence reviews highlighting dishes ordered in 1 tap.<br/>"
            "• <b>1-Tap Deep Linking to Google Maps:</b> Copies review to clipboard and opens Google Place Review page in 3 seconds.<br/>"
            "• <b>Rich Local Keyword Injection:</b> Reviews naturally incorporate high-intent keywords ('best butter chicken in Koregaon Park'), ranking your restaurant in Google's Top 3 Pack.<br/>"
            "• <b>+300 Verified Reviews Monthly:</b> A 20-table restaurant serving 100 tables/day averages 10-15 new 5-star Google reviews daily.",
            card_body
        )
    ]
    t_s9 = Table([[c9_content]], colWidths=[SLIDE_WIDTH - 100])
    t_s9.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1.5, c_border_gold),
        ('PADDING', (0,0), (-1,-1), 15),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s9)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 10: VIRAL 9:16 INSTAGRAM STORY STUDIO
    # =========================================================================
    story.append(Paragraph("// SOCIAL MEDIA VIRALITY", tag_rose))
    story.append(Paragraph("Viral 9:16 Instagram Story Studio: Organic Word-of-Mouth", title_style))
    story.append(Paragraph("Empower diners to share gorgeous, branded dish stories to thousands of local followers.", sub_style))

    c10_content = [
        Paragraph("How the 9:16 Visual Social Engine Drives Virality", card_h_rose),
        Paragraph(
            "• <b>Automated 9:16 Story Cards:</b> Diners tap 'Share to Story'. Menuz generates a studio-grade 9:16 vertical card with dish photo and restaurant logo in seconds.<br/>"
            "• <b>Pre-Configured @Handle & Location Tags:</b> Includes your exact Instagram handle (@restaurantname) and geo-location tag so friends tap directly to your profile.<br/>"
            "• <b>Zero Influencer Spend:</b> Replaces expensive food bloggers with 200+ authentic local diners posting real dining stories every week to their friends.<br/>"
            "• <b>Owner Choice: Dual Mode:</b> Owners can set reward unlock requirements to Google Review, Instagram Story, or allow diners to choose.",
            card_body
        )
    ]
    t_s10 = Table([[c10_content]], colWidths=[SLIDE_WIDTH - 100])
    t_s10.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1.5, c_border),
        ('PADDING', (0,0), (-1,-1), 15),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s10)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 11: GAMIFIED LUCKY WHEEL & ANTI-CHEAT SECURITY
    # =========================================================================
    story.append(Paragraph("// FRAUD PROTECTION", tag_cyan))
    story.append(Paragraph("Gamified Lucky Wheel & Triple-Layer Anti-Cheat Security", title_style))
    story.append(Paragraph("Diners love winning table rewards — while owners remain 100% protected against voucher fraud.", sub_style))

    c11_l = [
        Paragraph("Interactive Lucky Wheel", card_h_gold),
        Paragraph("• <b>Zero Forced Discounting:</b> Default prizes are 100% margin-safe culinary treats (Chef's dessert, artisanal cooler, VIP weekend pass).<br/>"
                  "• <b>Optional Owner-Decided Discount:</b> Operators can optionally enable custom % bill discounts (e.g. 5%, 10%, 15%) if preferred for off-peak days.<br/>"
                  "• <b>High Engagement:</b> Creates excitement at the table, boosting dining retention.<br/>"
                  "• <b>Tied to Billing:</b> Redemption is validated directly at checkout.", card_body)
    ]
    c11_r = [
        Paragraph("Triple Anti-Cheat Security", card_h_cyan),
        Paragraph("• <b>Live 15-Minute Ticking Clock:</b> Displays a dynamic seconds clock. Static screenshots or forwarded images are instantly rejected.<br/>"
                  "• <b>Waiter PIN Verification (1234):</b> Server physically enters secret PIN on diner's phone to void voucher.<br/>"
                  "• <b>Single-Use Cryptographic Lock:</b> Tied to Table X and session ID — cannot be forwarded.", card_body)
    ]

    t_s11 = Table([[c11_l, c11_r]], colWidths=[(SLIDE_WIDTH - 110)/2, (SLIDE_WIDTH - 110)/2])
    t_s11.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border_cyan),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s11)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 12: KITCHEN OPERATIONS (MODE A VS MODE B)
    # =========================================================================
    story.append(Paragraph("// KITCHEN OPERATIONS", tag_cyan))
    story.append(Paragraph("Direct Kitchen KOT & Universal POS Bridge (Mode A vs Mode B)", title_style))
    story.append(Paragraph("Owner-controlled dispatching with thermal printer hardware compatibility.", sub_style))

    c12_1 = [
        Paragraph("Mode A: Direct Auto-KOT to Kitchen", card_h_cyan),
        Paragraph("• Fires 80mm ESC/POS thermal ticket directly to kitchen printer in 1 second.<br/>"
                  "• Zero waiter re-typing — eliminates manual transcription mistakes and delays.<br/>"
                  "• Pre-formatted with preparation notes (spice calibration, allergen tags).<br/>"
                  "• <b>Best for:</b> High-turnover cafes, bistros, QSRs, and casual dining.", card_body)
    ]
    c12_2 = [
        Paragraph("Mode B: Floor Captain Review First", card_h_gold),
        Paragraph("• Order lands on Floor Captain's tablet first for review and verification.<br/>"
                  "• Captain checks bar inventory, course pacing, and custom guest requests.<br/>"
                  "• Captain taps 'Approve & Fire' to send KOT to kitchen thermal stations.<br/>"
                  "• <b>Best for:</b> Fine dining, multi-course dining, and rooftop lounges.", card_body)
    ]

    t_s12 = Table([[c12_1, c12_2]], colWidths=[(SLIDE_WIDTH - 110)/2, (SLIDE_WIDTH - 110)/2])
    t_s12.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s12)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 13: LIVE FLOOR COMMAND CENTER & KDS
    # =========================================================================
    story.append(Paragraph("// OPERATIONS HUB", tag_cyan))
    story.append(Paragraph("Live Floor Command Center & Kitchen Display System (KDS)", title_style))
    story.append(Paragraph("Real-time tablet management for managers, floor captains, and kitchen expeditors.", sub_style))

    c13_content = [
        Paragraph("Real-Time Operational Controls for Floor Staff & Kitchen", card_h_cyan),
        Paragraph(
            "• <b>Live Visual Table Map & Status Grid:</b> Color-coded table grid (🟢 Green = Dining, 🟡 Amber = Ordering, 🔵 Blue = Bill Requested, ⚪ Gray = Vacant).<br/>"
            "• <b>Service Call Management with Timers:</b> Push alerts for 'Waiter Summoned', 'Water Needed', or 'Bill' with response tracking to maintain <60s speed.<br/>"
            "• <b>Kitchen Expeditor Timers (KDS):</b> Countdown clocks on kitchen screens (Green <15m, Amber 15-25m, Red >25m) eliminate food delays.<br/>"
            "• <b>Universal POS Adapters:</b> Bi-directional bridging with Petpooja, RoyalPOS, Recaho, and RanceLab, plus direct network ESC/POS thermal printing.",
            card_body
        )
    ]
    t_s13 = Table([[c13_content]], colWidths=[SLIDE_WIDTH - 100])
    t_s13.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1.5, c_border_cyan),
        ('PADDING', (0,0), (-1,-1), 15),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s13)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 14: 5-MIN AI ONBOARDING STUDIO
    # =========================================================================
    story.append(Paragraph("// RAPID ONBOARDING", tag_gold))
    story.append(Paragraph("5-Minute AI Onboarding Studio & Partitioned Multi-Tenancy", title_style))
    story.append(Paragraph("Get any restaurant live in under 5 minutes with voice intake and isolated cloud storage.", sub_style))

    c14_1 = [
        Paragraph("AI Menu & Recipe Intake", card_h_cyan),
        Paragraph("Chefs speak or upload a photo of the paper menu. AI extracts dish names, categorizes courses, drafts flavor notes, and calibrates spice ratings in minutes.", card_body)
    ]
    c14_2 = [
        Paragraph("Partitioned Media Library", card_h_gold),
        Paragraph("Every partner restaurant has an isolated cloud image bank. High-res dish photography and branding are segregated with zero cross-tenant clutter.", card_body)
    ]
    c14_3 = [
        Paragraph("Standalone Branded Routes", card_h_emerald),
        Paragraph("Each restaurant operates on a dedicated URL (/r/:restaurantSlug) with custom brand theme, logo, and table tokens for direct Google Maps and bio links.", card_body)
    ]

    t_s14 = Table([[c14_1, c14_2, c14_3]], colWidths=[(SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3])
    t_s14.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s14)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 15: REGIONAL INCLUSIVITY (ENGLISH + HINDI + MARATHI)
    # =========================================================================
    story.append(Paragraph("// MULTILINGUAL HOSPITALITY", tag_cyan))
    story.append(Paragraph("Regional Inclusivity: English Primary with Hindi & Marathi", title_style))
    story.append(Paragraph("Preserving global appeal while honoring local hospitality and regional language preferences.", sub_style))

    c15_1 = [
        Paragraph("English (Default Primary)", card_h_gold),
        Paragraph("Hardcoded as the primary launch language for 100% of devices. No arbitrary IP or browser locale redirection. Global and tech-savvy diners feel instantly at home.", card_body)
    ]
    c15_2 = [
        Paragraph("हिन्दी (Hindi Native)", card_h_cyan),
        Paragraph("Comprehensive native translation for Starters, Main Course, Biryani, special kitchen cooking notes (खास स्वयंपाक सूचना), and kitchen dispatch.", card_body)
    ]
    c15_3 = [
        Paragraph("मराठी (Marathi Native)", card_h_emerald),
        Paragraph("Full regional translation celebrating Maharashtra's food culture (बिर्याणी, स्टार्टर्स, गोड पदार्थ, कॅप्टनला बोलवा), providing warm familiarity for family dining.", card_body)
    ]

    t_s15 = Table([[c15_1, c15_2, c15_3]], colWidths=[(SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3])
    t_s15.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 13),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s15)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 16: COMMERCIAL MODEL
    # =========================================================================
    story.append(Paragraph("// COMMERCIAL MODEL", tag_gold))
    story.append(Paragraph("Single Outlet ₹5,000/Mo • Enterprise ₹10,000/Mo • 0% Commission", title_style))
    story.append(Paragraph("Transparent subscription pricing with zero commission on food sales and 100% data ownership.", sub_style))

    c16_single = [
        Paragraph("Single Outlet Plan — ₹5,000 / Month", card_h_cyan),
        Paragraph(
            "<b>Ideal for Standalone Cafes, Fine Dining & High-Footfall Bistros:</b><br/>"
            "• <b>Full Interactive Dining OS:</b> Multiplayer cart sync, zero app download QR menus.<br/>"
            "• <b>Hardware-Free KOT Routing:</b> Instant thermal ESC/POS 80mm printing + WhatsApp failover.<br/>"
            "• <b>Reputation Triad Engine:</b> 1-Click Google review generator + 15-min floor shield recovery.<br/>"
            "• <b>Gamified Lucky Wheel:</b> 100% Owner Configured prizes (Zero forced bill discounts).<br/>"
            "• <b>100% Customer Data Ownership:</b> Full guest phone numbers & dining histories.<br/>"
            "• <b>Zero Setup Fees:</b> Month-to-month billing with no lock-in contracts.",
            card_body
        )
    ]

    c16_enterprise = [
        Paragraph("Multi-Outlet Enterprise — ₹10,000 / Month", card_h_gold),
        Paragraph(
            "<b>Built for Restaurant Groups, Pub Chains & Multi-Branch Franchises:</b><br/>"
            "• <b>Centralized Multi-Branch HQ:</b> Unified menu catalog sync & brand-wide performance.<br/>"
            "• <b>Multi-Kitchen & Bar Routing:</b> Load-balanced KOTs across separate culinary sections.<br/>"
            "• <b>Custom POS Integrations:</b> 2-Way REST API bridge for Petpooja, POSist, RanceLab, etc.<br/>"
            "• <b>White-Label Branding:</b> Custom domain, branded QR stands, and tailor-made themes.<br/>"
            "• <b>Branch Loyalty Rules:</b> Location-specific wheel reward quotas & fraud limits.<br/>"
            "• <b>24/7 Priority SLA:</b> Dedicated account manager and on-premise staff training.",
            card_body
        )
    ]

    t_s16 = Table([[c16_single, c16_enterprise]], colWidths=[(SLIDE_WIDTH - 110)/2, (SLIDE_WIDTH - 110)/2])
    t_s16.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1.5, c_border_gold),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s16)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 17: DETAILED PLAN COMPARISON & FEATURE MATRIX
    # =========================================================================
    story.append(Paragraph("// IN-DEPTH PLAN COMPARISON", tag_cyan))
    story.append(Paragraph("What Exactly You Get in Each Plan: Side-by-Side Matrix", title_style))
    story.append(Paragraph("Transparent feature breakdown between Single Outlet (₹5,000/mo) and Multi-Outlet Enterprise (₹10,000/mo).", sub_style))

    th_style = ParagraphStyle('ThStyle', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=c_gold)
    th_single = ParagraphStyle('ThSingle', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=c_cyan)
    th_ent = ParagraphStyle('ThEnt', fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=c_gold)
    td_feat = ParagraphStyle('TdFeat', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=c_text_white)
    td_sub = ParagraphStyle('TdSub', fontName='Helvetica', fontSize=7, leading=9, textColor=c_text_muted)
    td_val_c = ParagraphStyle('TdValC', fontName='Helvetica', fontSize=8, leading=10, textColor=c_cyan)
    td_val_g = ParagraphStyle('TdValG', fontName='Helvetica', fontSize=8, leading=10, textColor=c_gold)
    td_chk = ParagraphStyle('TdChk', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=c_emerald)

    matrix_rows = [
        [
            Paragraph("<b>Capability / Module</b>", th_style),
            Paragraph("<b>Single Outlet (₹5,000/mo)</b>", th_single),
            Paragraph("<b>Multi-Outlet Enterprise (₹10,000/mo)</b>", th_ent)
        ],
        [
            Paragraph("<b>Venue & Table Scale</b><br/><font color='#94A3B8'>Locations & QR codes</font>", td_feat),
            Paragraph("1 Location (Unlimited Tables)", td_val_c),
            Paragraph("Multi-Outlet (Unlimited Venues & Tables)", td_val_g)
        ],
        [
            Paragraph("<b>Interactive Dining & Multiplayer Cart</b><br/><font color='#94A3B8'>Live sync, zero app download</font>", td_feat),
            Paragraph("✓ Full Access", td_chk),
            Paragraph("✓ Full Access", td_chk)
        ],
        [
            Paragraph("<b>Multilingual AI Menu Engine</b><br/><font color='#94A3B8'>English, Hindi & Marathi + dietary</font>", td_feat),
            Paragraph("✓ Included", td_chk),
            Paragraph("✓ Included", td_chk)
        ],
        [
            Paragraph("<b>Kitchen KOT Thermal Printing</b><br/><font color='#94A3B8'>ESC/POS 80mm + WhatsApp alert</font>", td_feat),
            Paragraph("✓ Single Kitchen Station", td_chk),
            Paragraph("✓ Multi-Kitchen & Bar Routing", td_chk)
        ],
        [
            Paragraph("<b>POS System Integrations</b><br/><font color='#94A3B8'>Petpooja, POSist, RanceLab, etc.</font>", td_feat),
            Paragraph("Standard POS Bridge", td_val_c),
            Paragraph("Enterprise 2-Way REST API Sync", td_val_g)
        ],
        [
            Paragraph("<b>Google Maps SEO Review Engine</b><br/><font color='#94A3B8'>1-Click tags + 15-min floor shield</font>", td_feat),
            Paragraph("✓ Included", td_chk),
            Paragraph("✓ Included", td_chk)
        ],
        [
            Paragraph("<b>Gamified Wheel & Retention</b><br/><font color='#94A3B8'>100% Owner Configured Rewards</font>", td_feat),
            Paragraph("✓ Full Owner Control", td_chk),
            Paragraph("✓ Full Owner Control + Branch Rules", td_chk)
        ],
        [
            Paragraph("<b>Multi-Branch Centralized HQ</b><br/><font color='#94A3B8'>Cross-venue comparison & menu push</font>", td_feat),
            Paragraph("— (Single venue analytics)", td_sub),
            Paragraph("✓ Multi-Outlet Live Dashboard", td_val_g)
        ],
        [
            Paragraph("<b>Support SLA & Training</b><br/><font color='#94A3B8'>Deployment and team onboarding</font>", td_feat),
            Paragraph("Standard Email & Chat Support", td_val_c),
            Paragraph("24/7 Dedicated Account Manager", td_val_g)
        ]
    ]

    t_s17_matrix = Table(matrix_rows, colWidths=[(SLIDE_WIDTH - 100)*0.40, (SLIDE_WIDTH - 100)*0.30, (SLIDE_WIDTH - 100)*0.30])
    t_s17_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1A2436")),
        ('BACKGROUND', (0,1), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_s17_matrix)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 18: 15-RESTAURANT BOARDROOM STRESS TEST
    # =========================================================================
    story.append(Paragraph("// MARKET VALIDATION", tag_cyan))
    story.append(Paragraph("The 15-Restaurant Boardroom Stress Test: Unanimous Approval", title_style))
    story.append(Paragraph("How Menuz addresses the hardest operational objections across diverse dining formats.", sub_style))

    c17_1 = [
        Paragraph("Cafes & High-Turnover", card_h_cyan),
        Paragraph("<b>German Bakery, Le Plaisir, Vaishali</b><br/>"
                  "• <i>Objection:</i> 'We serve 200+ tables/day, tech must be instant.'<br/>"
                  "• <i>Solution:</i> Zero app downloads. Mode A fires direct 80mm KOT in 1s.<br/>"
                  "• <i>Outcome:</i> Turns tables 14 minutes faster per seating.", card_body)
    ]
    c17_2 = [
        Paragraph("Fine Dining & Bistros", card_h_gold),
        Paragraph("<b>Arthur's Theme, Malaka Spice, Terttulia</b><br/>"
                  "• <i>Objection:</i> 'We cannot lose human captain hospitality.'<br/>"
                  "• <i>Solution:</i> Mode B captain review preserves personal touch.<br/>"
                  "• <i>Outcome:</i> Chef AI wine pairings increase beverage checks by +24%.", card_body)
    ]
    c17_3 = [
        Paragraph("Breweries & Restobars", card_h_rose),
        Paragraph("<b>Effingut, FC Road Social, Agent Jack's</b><br/>"
                  "• <i>Objection:</i> 'Large groups cause duplicate ordering chaos.'<br/>"
                  "• <i>Solution:</i> Multiplayer table sync unifies orders with guest tags.<br/>"
                  "• <i>Outcome:</i> 9:16 Instagram Story engine drives massive weekend reach.", card_body)
    ]

    t_s18_stress = Table([[c17_1, c17_2, c17_3]], colWidths=[(SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3, (SLIDE_WIDTH - 120)/3])
    t_s18_stress.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.75, c_border),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_s18_stress)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 19: SUMMARY, METRICS & LIVE PLATFORM
    # =========================================================================
    s19_content = [
        [
            Paragraph("<b>Transform Your Restaurant with Menuz</b>", ParagraphStyle('EndTitle', fontName='Helvetica-Bold', fontSize=28, leading=32, textColor=c_text_white)),
        ],
        [
            Paragraph("The All-in-One Dine-In Operating System & Growth Engine", ParagraphStyle('EndSub', fontName='Helvetica-Bold', fontSize=16, leading=20, textColor=c_gold)),
        ],
        [
            Paragraph(
                "⚡  <b>+22% Average Ticket Value</b> via Smart Pairings & Upsells (Zero Forced Discounts)<br/>"
                "⚡  <b>+300 Verified 5-Star Reviews</b> or Viral Instagram Stories Monthly<br/>"
                "⚡  <b>Zero Lost Orders</b> with Multi-Channel KOT Failover (Port 9100 / LAN / POS)<br/>"
                "⚡  <b>Diner Service Response Times</b> Cut from 10 Mins to Under 60 Seconds<br/>"
                "⚡  <b>100% Customer Data Ownership</b> with Zero Delivery Commissions",
                ParagraphStyle('EndStats', fontName='Helvetica', fontSize=13, leading=19, textColor=c_text_sub)
            )
        ],
        [
            Paragraph("<b>Live Platform:</b> stgtrgjrccx.github.io/menuz  •  <b>Contact:</b> partner@menuz.in", ParagraphStyle('EndContact', fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=c_cyan))
        ]
    ]
    t_s19 = Table(s19_content, colWidths=[SLIDE_WIDTH - 100])
    t_s19.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 2, c_cyan),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_s19)

    # Build PDF with slide background & footer callbacks
    doc.build(story, onFirstPage=draw_slide_decorations, onLaterPages=draw_slide_decorations)
    print(f"Successfully generated Midnight Obsidian 16:9 Landscape PDF: {output_path}")

if __name__ == "__main__":
    out_dir = os.path.join(os.getcwd(), 'public')
    os.makedirs(out_dir, exist_ok=True)
    out_pdf = os.path.join(out_dir, 'menuz_executive_pitch_deck.pdf')
    generate_landscape_slide_pdf(out_pdf)
    generate_landscape_slide_pdf(os.path.join(out_dir, 'menuz_complete_pitch_and_product_deck.pdf'))
