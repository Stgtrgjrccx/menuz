import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_pptx_path):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Menuz Brand Color Palette
    C_CHARCOAL_DARK = RGBColor(0x1C, 0x19, 0x17)    # #1C1917
    C_CHARCOAL_CARD = RGBColor(0x29, 0x25, 0x24)    # #292524
    C_SAFFRON = RGBColor(0xE8, 0x5D, 0x04)          # #E85D04
    C_SAFFRON_LIGHT = RGBColor(0xF9, 0x73, 0x16)    # #F97316
    C_IVORY_BG = RGBColor(0xFD, 0xFB, 0xF7)         # #FDFBF7
    C_IVORY_CARD = RGBColor(0xFF, 0xFF, 0xFF)       # #FFFFFF
    C_BORDER = RGBColor(0xE7, 0xE5, 0xE4)           # #E7E5E4
    C_EMERALD = RGBColor(0x05, 0x96, 0x69)          # #059669
    C_BLUE = RGBColor(0x25, 0x63, 0xEB)             # #2563EB
    C_MUTED = RGBColor(0x57, 0x53, 0x4E)            # #57534E
    C_WHITE = RGBColor(0xFF, 0xFF, 0xFF)

    def add_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=None, is_dark=False):
        # Category Tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.5), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_right = tf_tag.margin_top = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_SAFFRON

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.5), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Georgia"
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE if is_dark else C_CHARCOAL_DARK

        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.42), Inches(11.5), Inches(0.4))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_right = tf_sub.margin_top = tf_sub.margin_bottom = 0
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(12)
            p_sub.font.color.rgb = RGBColor(0xD6, 0xD3, 0xD1) if is_dark else C_MUTED

    def add_card(slide, left, top, width, height, bg_color=C_IVORY_CARD, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: COVER SLIDE (DARK LUXURY)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, C_CHARCOAL_DARK)

    # Accent decorative bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.8), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_SAFFRON
    bar.line.fill.background()

    # Brand Title
    s1_title_box = s1.shapes.add_textbox(Inches(0.8), Inches(2.1), Inches(11.5), Inches(1.5))
    tf1 = s1_title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "MENUZ"
    p1.font.name = "Georgia"
    p1.font.size = Pt(56)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "The Restaurant Experience & Kitchen Operating System"
    p1_sub.font.name = "Georgia"
    p1_sub.font.size = Pt(26)
    p1_sub.font.color.rgb = C_SAFFRON
    p1_sub.space_before = Pt(10)

    # Description Box
    s1_desc_box = s1.shapes.add_textbox(Inches(0.8), Inches(4.0), Inches(11.5), Inches(1.2))
    tf1_desc = s1_desc_box.text_frame
    tf1_desc.word_wrap = True
    p1_d = tf1_desc.paragraphs[0]
    p1_d.text = "Turn Every Table into High-Margin Orders, Real-Time Collaboration & Direct Kitchen Precision."
    p1_d.font.name = "Arial"
    p1_d.font.size = Pt(16)
    p1_d.font.color.rgb = RGBColor(0xE7, 0xE5, 0xE4)

    p1_d2 = tf1_desc.add_paragraph()
    p1_d2.text = "Multiplayer Table Sync • English / Hindi / Marathi • Direct Kitchen KOT • Chef AI Concierge • Viral Instagram Cards"
    p1_d2.font.name = "Arial"
    p1_d2.font.size = Pt(13)
    p1_d2.font.color.rgb = RGBColor(0xA8, 0xA2, 0x9E)
    p1_d2.space_before = Pt(8)

    # Footer Metadata
    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.3), Inches(11.5), Inches(0.5))
    tf_meta = meta_box.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "CONFIDENTIAL EXECUTIVE PRODUCT & OPERATIONS DECK • 2026 EDITION • MENUZ PLATFORM"
    p_meta.font.name = "Arial"
    p_meta.font.size = Pt(10)
    p_meta.font.color.rgb = RGBColor(0x78, 0x71, 0x6C)

    # =========================================================================
    # SLIDE 2: THE 3 CORE RESTAURANT PROFIT LEAKS
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, C_IVORY_BG)
    add_header(s2, "Industry Challenge", "The Three Critical Profit Leaks in Modern Dining", "Why traditional paper menus and standalone POS terminals cost restaurants up to 30% in lost revenue.")

    leaks = [
        ("01. Diners Left Without Guidance", 
         "Waiters are rushed and under-trained. They cannot articulate chef heritage, secret recipes, or suggest high-margin wine & cocktail pairings. Up to 40% of diners stick to safe, low-margin staples."),
        ("02. Brittle POS & Delayed KOTs", 
         "Cloud-only POS systems drop orders during peak Wi-Fi fluctuations. Orders pile up, kitchen preparation gets delayed, and hungry guests experience frustrating table waits."),
        ("03. Lost Reviews & Language Gaps", 
         "Satisfied guests leave without posting a Google review, while one upset guest posts a permanent 1-star rating. Furthermore, non-English speaking diners face awkward communication hurdles.")
    ]

    card_w = Inches(3.64)
    card_h = Inches(4.5)
    card_top = Inches(2.1)

    for i, (ltitle, ldesc) in enumerate(leaks):
        left = Inches(0.8 + i * 4.0)
        add_card(s2, left, card_top, card_w, card_h, C_IVORY_CARD, C_BORDER)
        
        # Inner text
        tb = s2.shapes.add_textbox(left + Inches(0.3), card_top + Inches(0.4), card_w - Inches(0.6), card_h - Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = ltitle
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON
        
        p2 = tf.add_paragraph()
        p2.text = ldesc
        p2.font.name = "Arial"
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(16)

    # =========================================================================
    # SLIDE 3: MENUZ PRODUCT ECOSYSTEM OVERVIEW
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, C_IVORY_BG)
    add_header(s3, "Comprehensive Architecture", "The Menuz Connected Dining Platform", "Six integrated layers designed for diners, kitchen brigades, and restaurant owners.")

    pillars = [
        ("📱 Real-Time Multiplayer Table Sync", "Multiple diners at the same table add dishes together with live guest indicators and joint tray management."),
        ("🌐 Multilingual Engine (EN / HI / MR)", "English as the default primary language, with physical 1-click toggles for Hindi (हिन्दी) & Marathi (मराठी)."),
        ("⚡ Direct Kitchen KOT Engine", "Owner-controlled direct routing to kitchen thermal printers & POS lines, bypassing manual floor delays."),
        ("🧑‍🍳 Chef AI Sommelier & Pairings", "Curated wine/beverage pairings, auto-scrolling chef advice, and bundle discounts that increase order size by 20%+."),
        ("📸 Viral Instagram Story Studio", "Automated 9:16 vertical story cards featuring restaurant photography and tags for diner social sharing."),
        ("⭐ 4-Step Review Booster & Floor Shield", "AI review generator + Google Maps verification + spin-to-win dessert wheel, with private sub-4 star manager alerts.")
    ]

    for i, (ptitle, pdesc) in enumerate(pillars):
        row = i // 3
        col = i % 3
        left = Inches(0.8 + col * 4.0)
        top = Inches(2.0 + row * 2.4)
        add_card(s3, left, top, Inches(3.64), Inches(2.15), C_IVORY_CARD, C_BORDER)

        tb = s3.shapes.add_textbox(left + Inches(0.25), top + Inches(0.25), Inches(3.14), Inches(1.65))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = ptitle
        p.font.name = "Georgia"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_CHARCOAL_DARK

        p2 = tf.add_paragraph()
        p2.text = pdesc
        p2.font.name = "Arial"
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 4: REAL-TIME TABLE MULTIPLAYER SYNC
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, C_CHARCOAL_DARK)
    add_header(s4, "Multiplayer Collaboration", "Live Table Cart Sync & Joint Ordering", "Transform dining from isolated smartphone screens into an engaging group ritual.", is_dark=True)

    # Left Card
    left_card = add_card(s4, Inches(0.8), Inches(2.1), Inches(5.6), Inches(4.5), C_CHARCOAL_CARD, None)
    tb_l = s4.shapes.add_textbox(Inches(1.2), Inches(2.4), Inches(4.8), Inches(3.8))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "How Multiplayer Table Sync Works"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    pts = [
        ("Zero App Installation", "Guests scan the table QR code and are instantly grouped into Table X's live shared dining session."),
        ("Multi-Guest Attribution", "Each added dish displays the guest identifier (e.g. '👤 Guest 2') so everyone knows who ordered what."),
        ("Instant Tray Synchronization", "Quantities, customizations, and spice levels update dynamically across all phones at the table in real-time."),
        ("Single Joint Kitchen Dispatch", "Table can review the unified order, add special cooking notes, and dispatch directly to the kitchen in one click.")
    ]
    for h, b in pts:
        p_pt = tf_l.add_paragraph()
        p_pt.text = f"• {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(11.5)
        p_pt.font.color.rgb = RGBColor(0xD6, 0xD3, 0xD1)
        p_pt.space_before = Pt(10)

    # Right Card: Operator Benefits
    right_card = add_card(s4, Inches(6.8), Inches(2.1), Inches(5.7), Inches(4.5), C_CHARCOAL_CARD, None)
    tb_r = s4.shapes.add_textbox(Inches(7.2), Inches(2.4), Inches(4.9), Inches(3.8))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "Operational & Business Impact"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    b_pts = [
        ("No Disjointed Tickets", "Prevents duplicate or fragmented orders coming from the same table at different times."),
        ("Higher Average Order Value (+22%)", "Guests see appetizing items and cocktail pairings ordered by table companions and add their own."),
        ("Drastic Floor Labor Savings", "Waitstaff no longer spend 8-12 minutes per table writing down individual orders; they focus on hospitality.")
    ]
    for h, b in b_pts:
        p_pt = tf_r.add_paragraph()
        p_pt.text = f"✓ {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = C_WHITE
        p_pt.space_before = Pt(14)

    # =========================================================================
    # SLIDE 5: MULTILINGUAL ARCHITECTURE (ENGLISH + HINDI + MARATHI)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, C_IVORY_BG)
    add_header(s5, "Regional Inclusivity", "Multilingual Dining: English Primary, Hindi & Marathi", "Preserving global appeal while honoring local hospitality and regional language preference.")

    m_cards = [
        ("English (Default Primary)", "Strict Rule: Always First", "English is hardcoded as the primary launch language for 100% of devices. No arbitrary IP or browser locale redirection. Global diners feel instantly at home."),
        ("हिन्दी (Hindi Native)", "Physical 1-Click Toggle", "Comprehensive native translation for Starters, Main Course, Biryani, special kitchen cooking notes (खास स्वयंपाक सूचना), and kitchen dispatch."),
        ("मराठी (Marathi Native)", "Local Cultural Resonance", "Full regional translation celebrating Maharashtra's food culture (बिर्याणी, स्टार्टर्स, गोड पदार्थ, कॅप्टनला बोलवा), providing warm familiarity for family dining.")
    ]

    for i, (mtitle, msub, mdesc) in enumerate(m_cards):
        left = Inches(0.8 + i * 4.0)
        add_card(s5, left, Inches(2.1), Inches(3.64), Inches(4.5), C_IVORY_CARD, C_BORDER)

        tb = s5.shapes.add_textbox(left + Inches(0.3), Inches(2.4), Inches(3.04), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = mtitle
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON if i == 0 else C_CHARCOAL_DARK

        p_sub = tf.add_paragraph()
        p_sub.text = msub.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_BLUE if i == 0 else C_EMERALD
        p_sub.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = mdesc
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(12)
        p_desc.font.color.rgb = C_MUTED
        p_desc.space_before = Pt(14)

    # =========================================================================
    # SLIDE 6: DIRECT KITCHEN KOT ENGINE (OWNER-CONTROLLED & OPTIONAL)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, C_IVORY_BG)
    add_header(s6, "Kitchen Operations", "Direct Kitchen KOT: 100% Owner-Controlled & Optional", "Empowering the restaurant owner to choose between automated line printing and manual captain approval.")

    # Two Column Layout
    col_w = Inches(5.6)
    c1 = add_card(s6, Inches(0.8), Inches(2.1), col_w, Inches(4.6), C_IVORY_CARD, C_BORDER)
    tb1 = s6.shapes.add_textbox(Inches(1.1), Inches(2.4), col_w - Inches(0.6), Inches(4.0))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Mode A: Direct Auto-KOT to Kitchen"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    a_pts = [
        "Instant thermal printout at kitchen station (ESC/POS 80mm)",
        "Zero waiter bottleneck — cuts order lead time by 7-10 minutes",
        "Direct bridge to Petpooja, Recaho, RanceLab, or RoyalPOS",
        "Ideal for busy cafes, craft breweries, casual dining, and bistros"
    ]
    for pt in a_pts:
        p_sub = tf1.add_paragraph()
        p_sub.text = f"⚡ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11.5)
        p_sub.font.color.rgb = C_CHARCOAL_DARK
        p_sub.space_before = Pt(8)

    c2 = add_card(s6, Inches(6.9), Inches(2.1), col_w, Inches(4.6), C_IVORY_CARD, C_BORDER)
    tb2 = s6.shapes.add_textbox(Inches(7.2), Inches(2.4), col_w - Inches(0.6), Inches(4.0))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Mode B: Floor Captain Verification"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    b_pts = [
        "Order lands on Manager / Captain Hub tablet first",
        "Captain reviews special allergies, bar inventory, or course sequencing",
        "Captain taps 'Approve & Fire' to send ticket to kitchen printers",
        "Ideal for luxury fine dining, multi-course banquet service, and VIP lounges"
    ]
    for pt in b_pts:
        p_sub = tf2.add_paragraph()
        p_sub.text = f"🛡️ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11.5)
        p_sub.font.color.rgb = C_CHARCOAL_DARK
        p_sub.space_before = Pt(8)

    # =========================================================================
    # SLIDE 7: CHEF PAIRINGS & REVENUE UPSELL ENGINE
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7, C_IVORY_BG)
    add_header(s7, "Revenue Maximization", "Smart Chef Pairings & Bundle Upsell Engine", "Increasing average ticket sizes with contextual AI culinary recommendations.")

    cards_7 = [
        ("Intelligent Pairing Logic", "When a diner adds an artisan curry or steak to their cart, Menuz automatically surfaces curated drink & side pairings (e.g. Garlic Naan + Smoked Lassi or Cabernet Sauvignon)."),
        ("Customizable Bundle Deals", "Owners can configure promotional pairing discounts (e.g. 10% or 15% off when added as a pair), giving diners irresistible value while growing net spend."),
        ("1-Click Tray Quick Add", "No complex navigation: diners tap '+ Add' directly inside the dining cart drawer, instantly recalculating taxes, GST, and totals.")
    ]

    for i, (t7, d7) in enumerate(cards_7):
        left = Inches(0.8 + i * 4.0)
        add_card(s7, left, Inches(2.1), Inches(3.64), Inches(4.5), C_IVORY_CARD, C_BORDER)
        tb = s7.shapes.add_textbox(left + Inches(0.3), Inches(2.4), Inches(3.04), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t7
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON

        p2 = tf.add_paragraph()
        p2.text = d7
        p2.font.name = "Arial"
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 8: AI SOMMELIER & CULINARY CONCIERGE
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8, C_CHARCOAL_DARK)
    add_header(s8, "Interactive AI Concierge", "Chef & Owner AI Sommelier: Always Answering, Auto-Scrolling", "A personalized conversational AI trained on the head chef's secrets, lore, and flavor profiles.", is_dark=True)

    add_card(s8, Inches(0.8), Inches(2.1), Inches(11.733), Inches(4.6), C_CHARCOAL_CARD, None)
    tb8 = s8.shapes.add_textbox(Inches(1.2), Inches(2.4), Inches(10.9), Inches(4.0))
    tf8 = tb8.text_frame
    tf8.word_wrap = True

    p = tf8.paragraphs[0]
    p.text = "Key Conversational Capabilities & UX Upgrades"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    chat_features = [
        ("Auto-Scroll Response UX", "When a diner taps a quick suggestion chip (e.g. 'What is the chef special?', 'Pair a cocktail with Truffle Pasta'), the chat window automatically scrolls down to the latest reply so the diner never has to scroll manually."),
        ("Chef & Owner Persona Voice", "Speaks with authentic authority on heirloom ingredients, 24-hour slow braising techniques, and dietary safety."),
        ("Precise Spice Calibration (1-5)", "Translates subjective spiciness into clear benchmarks (1 = Mild aromatic, 3 = Authentic warmth, 5 = Fiery chili)."),
        ("Allergy & Dietary Protection", "Instantly filters for vegan, Jain-friendly, nut-free, and gluten-free items, tagging the kitchen KOT with clear precautions.")
    ]
    for h, d in chat_features:
        p_cf = tf8.add_paragraph()
        p_cf.text = f"✨ {h}: {d}"
        p_cf.font.name = "Arial"
        p_cf.font.size = Pt(12)
        p_cf.font.color.rgb = C_WHITE
        p_cf.space_before = Pt(12)

    # =========================================================================
    # SLIDE 9: VIRAL INSTAGRAM STORY CARDS
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9, C_IVORY_BG)
    add_header(s9, "Social Growth", "Viral Food Instagram Story Studio", "Turn every dish ordered into organic social media footfall for the restaurant.")

    c9_left = add_card(s9, Inches(0.8), Inches(2.1), Inches(6.0), Inches(4.6), C_IVORY_CARD, C_BORDER)
    tb9_l = s9.shapes.add_textbox(Inches(1.1), Inches(2.4), Inches(5.4), Inches(4.0))
    tf9_l = tb9_l.text_frame
    tf9_l.word_wrap = True
    p = tf9_l.paragraphs[0]
    p.text = "Instant 9:16 Social Story Asset"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    insta_pts = [
        "Diners click 'Instagram Story' on any signature dish card.",
        "Generates a beautiful 9:16 vertical card with high-res dish photography, restaurant branding, and chef highlights.",
        "Equipped with 1-click Download and Share to Instagram Stories / WhatsApp Status.",
        "Includes restaurant location tags and hashtags to drive local organic discovery."
    ]
    for pt in insta_pts:
        p_pt = tf9_l.add_paragraph()
        p_pt.text = f"📸 {pt}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = C_CHARCOAL_DARK
        p_pt.space_before = Pt(10)

    c9_right = add_card(s9, Inches(7.3), Inches(2.1), Inches(5.2), Inches(4.6), C_IVORY_CARD, C_BORDER)
    tb9_r = s9.shapes.add_textbox(Inches(7.6), Inches(2.4), Inches(4.6), Inches(4.0))
    tf9_r = tb9_r.text_frame
    tf9_r.word_wrap = True
    p = tf9_r.paragraphs[0]
    p.text = "Restaurateur Marketing Impact"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    roi_pts = [
        "Zero Influencer Costs: Authentic diner word-of-mouth reaches real friends and local foodies.",
        "Consistent Visual Quality: Replaces unflattering flash photos with professional catalog photography.",
        "Measurable Discovery: Diners' friends see the exact table dish and visit the restaurant."
    ]
    for pt in roi_pts:
        p_pt = tf9_r.add_paragraph()
        p_pt.text = f"📈 {pt}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(12)
        p_pt.font.color.rgb = C_MUTED
        p_pt.space_before = Pt(12)

    # =========================================================================
    # SLIDE 10: MULTI-RESTAURANT PERSISTENCE & MASTER IMAGE LIBRARY
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10, C_IVORY_BG)
    add_header(s10, "Platform Multi-Tenancy", "Multi-Restaurant Persistence & Master Image Library", "Managing hundreds of partner restaurants with bulletproof data persistence and media organization.")

    c10_items = [
        ("Curated Restaurant Image Library", "The master image library is strictly organized by restaurant listings with high-resolution culinary photography partitioned per restaurant — eliminating media clutter."),
        ("Independent Branded Websites", "Each restaurant operates on its own dedicated route (/r/:restaurantSlug) or custom domain, featuring custom logos, cuisines, and styling."),
        ("Permanent LocalStorage Persistence", "Onboarded restaurants, custom menus, and smart settings are permanently saved — ensuring newly registered restaurants never disappear on reload.")
    ]

    for i, (t10, d10) in enumerate(c10_items):
        left = Inches(0.8 + i * 4.0)
        add_card(s10, left, Inches(2.1), Inches(3.64), Inches(4.5), C_IVORY_CARD, C_BORDER)
        tb = s10.shapes.add_textbox(left + Inches(0.3), Inches(2.4), Inches(3.04), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t10
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON

        p2 = tf.add_paragraph()
        p2.text = d10
        p2.font.name = "Arial"
        p2.font.size = Pt(12)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 11: GAMIFIED REVIEW BOOSTER & FLOOR SHIELD
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11, C_IVORY_BG)
    add_header(s11, "Reputation Management", "The 4-Step Review Booster & Private Floor Shield", "How Menuz turns happy diners into verified 5-star Google reviews while eliminating negative feedback.")

    steps = [
        ("Step 1: AI Review Generator", "Diner taps 'Claim Reward'. AI drafts a tailored review based on ordered dishes, highlighting chef craftsmanship & ambiance."),
        ("Step 2: Verification Check", "Smart verification gate ensures the guest has genuinely copied the review before proceeding to the reward step."),
        ("Step 3: Spin-to-Win Wheel", "An interactive, celebratory lucky wheel lets the guest spin for a complimentary dessert, cocktail, or reward."),
        ("Step 4: Sub-4 Star Floor Shield", "Ratings under 4 stars remain strictly internal and trigger an instant red alert on the manager console for tableside recovery.")
    ]

    for i, (stitle, sdesc) in enumerate(steps):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 6.0)
        top = Inches(2.1 + row * 2.4)
        add_card(s11, left, top, Inches(5.6), Inches(2.15), C_IVORY_CARD, C_BORDER)

        tb = s11.shapes.add_textbox(left + Inches(0.3), top + Inches(0.25), Inches(5.0), Inches(1.65))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = stitle
        p.font.name = "Georgia"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON if i < 3 else C_BLUE

        p2 = tf.add_paragraph()
        p2.text = sdesc
        p2.font.name = "Arial"
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 12: DIRECT RESTAURANT ACCESS & DEPLOYMENT ROADMAP
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12, C_CHARCOAL_DARK)
    add_header(s12, "Partnership & Rollout", "Direct Access Onboarding (No Arbitrary Trials)", "You control access directly — granting instant, complete capabilities to partner restaurants.", is_dark=True)

    add_card(s12, Inches(0.8), Inches(2.1), Inches(11.733), Inches(4.6), C_CHARCOAL_CARD, None)
    tb12 = s12.shapes.add_textbox(Inches(1.2), Inches(2.4), Inches(10.9), Inches(4.0))
    tf12 = tb12.text_frame
    tf12.word_wrap = True

    p = tf12.paragraphs[0]
    p.text = "Fast 3-Stage Restaurant Launch Process"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    rollout_steps = [
        ("Step 1: Direct Access Grant & Profile Setup (15 Mins)", "Directly onboard the restaurant without trial restrictions or expiry counters. Upload logo, authentic photography, and configure chef backstory."),
        ("Step 2: Smart Operations Configuration (5 Mins)", "Toggle Direct KOT routing, set Happy Hour surge pricing, configure Chef Pairings bundle discounts, and select language preferences."),
        ("Step 3: QR Stands Deployment & Live Floor Operations", "Place acrylic QR codes on dining tables. Diners experience real-time table sync, multilingual menus, and automated 5-star review generation.")
    ]
    for h, d in rollout_steps:
        p_rs = tf12.add_paragraph()
        p_rs.text = f"🚀 {h}\n   {d}"
        p_rs.font.name = "Arial"
        p_rs.font.size = Pt(12)
        p_rs.font.color.rgb = C_WHITE
        p_rs.space_before = Pt(12)

    # =========================================================================
    # SLIDE 13: SUMMARY, ROI & LIVE HUB
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13, C_CHARCOAL_DARK)

    # Big Banner
    tb13 = s13.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.733), Inches(4.5))
    tf13 = tb13.text_frame
    tf13.word_wrap = True

    p = tf13.paragraphs[0]
    p.text = "Transform Your Restaurant Operations Today"
    p.font.name = "Georgia"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p_sub = tf13.add_paragraph()
    p_sub.text = "Real-Time Collaboration • Multilingual Inclusivity • Direct Kitchen KOT • 5-Star Reputation"
    p_sub.font.name = "Georgia"
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = C_SAFFRON
    p_sub.space_before = Pt(12)

    stats = [
        "+22% Average Ticket Value via Smart Pairings",
        "+300 Verified 5-Star Google Reviews Every Month",
        "Zero Lost Orders with Multi-Channel KOT Failover",
        "Full Hindi, Marathi & English Language Coverage"
    ]
    for s in stats:
        p_stat = tf13.add_paragraph()
        p_stat.text = f"✓  {s}"
        p_stat.font.name = "Arial"
        p_stat.font.size = Pt(14)
        p_stat.font.color.rgb = RGBColor(0xE7, 0xE5, 0xE4)
        p_stat.space_before = Pt(10)

    p_cta = tf13.add_paragraph()
    p_cta.text = "Explore the Live Interactive Platform: stgtrgjrccx.github.io/menuz"
    p_cta.font.name = "Arial"
    p_cta.font.size = Pt(13)
    p_cta.font.bold = True
    p_cta.font.color.rgb = C_SAFFRON_LIGHT
    p_cta.space_before = Pt(20)

    # Save
    prs.save(output_pptx_path)
    print(f"Successfully created presentation: {output_pptx_path}")

if __name__ == "__main__":
    out_dir = os.path.join(os.getcwd(), 'public')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'menuz_executive_pitch_deck.pptx')
    create_deck(out_file)
