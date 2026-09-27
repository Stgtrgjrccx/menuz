import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
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
    C_PURPLE = RGBColor(0x7C, 0x3A, 0xED)           # #7C3AED
    C_PINK = RGBColor(0xDB, 0x27, 0x77)             # #DB2777
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
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.32))
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
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.55))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Georgia"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE if is_dark else C_CHARCOAL_DARK

        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.5), Inches(0.4))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_right = tf_sub.margin_top = tf_sub.margin_bottom = 0
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(11.5)
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

    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.8), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_SAFFRON
    bar.line.fill.background()

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
    p1_sub.text = "The Complete Dine-In Operating System & Growth Engine"
    p1_sub.font.name = "Georgia"
    p1_sub.font.size = Pt(26)
    p1_sub.font.color.rgb = C_SAFFRON
    p1_sub.space_before = Pt(10)

    s1_desc_box = s1.shapes.add_textbox(Inches(0.8), Inches(4.0), Inches(11.5), Inches(1.2))
    tf1_desc = s1_desc_box.text_frame
    tf1_desc.word_wrap = True
    p1_d = tf1_desc.paragraphs[0]
    p1_d.text = "Everything a Modern Restaurant Needs: Interactive Menus, Real-Time Table Sync, Chef AI, Direct Kitchen KOT, and Owner-Configurable Viral Growth."
    p1_d.font.name = "Arial"
    p1_d.font.size = Pt(16)
    p1_d.font.color.rgb = RGBColor(0xE7, 0xE5, 0xE4)

    p1_d2 = tf1_desc.add_paragraph()
    p1_d2.text = "What Exactly Is This Product? • Complete Feature Breakdown & Architectural Overview"
    p1_d2.font.name = "Arial"
    p1_d2.font.size = Pt(13)
    p1_d2.font.color.rgb = RGBColor(0xA8, 0xA2, 0x9E)
    p1_d2.space_before = Pt(8)

    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.3), Inches(11.5), Inches(0.5))
    tf_meta = meta_box.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "CONFIDENTIAL EXECUTIVE PRODUCT OVERVIEW • 2026 EDITION • MENUZ PLATFORM"
    p_meta.font.name = "Arial"
    p_meta.font.size = Pt(10)
    p_meta.font.color.rgb = RGBColor(0x78, 0x71, 0x6C)

    # =========================================================================
    # SLIDE 2: WHAT EXACTLY IS MENUZ? (CORE PRODUCT IDENTITY)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, C_IVORY_BG)
    add_header(s2, "Product Overview", "What Exactly Is Menuz?", "An all-in-one web-based operating system that transforms dine-in tables into high-speed, high-margin, viral dining hubs.")

    core_pillars = [
        ("1. Digital Interactive Menu", "Zero app download. Diners scan table QR code to explore high-res dishes, calibrated spice meters, calorie counts, chef secret notes, and dietary filters."),
        ("2. Real-Time Multiplayer Sync", "Everyone at Table 4 co-orders together in real-time. Live shared cart tray with guest tags prevents duplicate orders and unifies billing."),
        ("3. Chef AI Concierge & Upsells", "Trained on head chef's marinades and owner's upsell rules. Suggests high-margin wine, mocktail, and side pairings (+22% average check)."),
        ("4. Direct Kitchen KOT Routing", "Owner-controlled: Send orders directly to kitchen thermal printers in 1 second (Mode A) or route to floor captain for approval (Mode B)."),
        ("5. Owner-Configurable Viral Growth", "Owner chooses: unlock table rewards via 5-Star Google Reviews OR 9:16 Instagram Stories with restaurant tags."),
        ("6. Floor Operations & Service SOS", "Waiters called with 1 tap ('Call Waiter', 'Water', 'Bill'). Real-time manager tablet hub for table occupancy and prep timers.")
    ]

    for i, (ctitle, cdesc) in enumerate(core_pillars):
        row = i // 3
        col = i % 3
        left = Inches(0.8 + col * 4.0)
        top = Inches(2.0 + row * 2.5)
        add_card(s2, left, top, Inches(3.64), Inches(2.25), C_IVORY_CARD, C_BORDER)

        tb = s2.shapes.add_textbox(left + Inches(0.25), top + Inches(0.25), Inches(3.14), Inches(1.75))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = ctitle
        p.font.name = "Georgia"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON

        p2 = tf.add_paragraph()
        p2.text = cdesc
        p2.font.name = "Arial"
        p2.font.size = Pt(11)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: VISUAL DIGITAL MENU & CULINARY LORE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, C_CHARCOAL_DARK)
    add_header(s3, "Diner Table Interface", "Visual Digital Menu: Engaging Appetites Before Ordering", "Replacing flat paper text with rich culinary storytelling, calibrated heat meters, and smart dietary tags.", is_dark=True)

    c3_left = add_card(s3, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.7), C_CHARCOAL_CARD, None)
    tb3_l = s3.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.1))
    tf3_l = tb3_l.text_frame
    tf3_l.word_wrap = True
    p = tf3_l.paragraphs[0]
    p.text = "Visual Menu Architecture"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    menu_features = [
        ("High-Resolution Photography", "Every signature dish showcases authentic culinary plating, driving immediate appetite stimulation."),
        ("Spice Meter Calibration (1-5)", "Clear visual heat rating (1 = Mild Cashew Cream, 5 = Fiery Guntur Chili) prevents customer spice mismatch."),
        ("Calorie & Nutritional Info", "Calorie counters and macro indicators for health-conscious diners."),
        ("Dietary & Allergen Badges", "Instant filtering for Pure Veg (🟢), Non-Veg (🔴), Vegan, Jain (नो रूट वेजिटेबल्स), and 100% Gluten-Free items."),
        ("Chef's Secret Notes & Lore", "Shares slow-braising times, charcoal tandoor techniques, and hand-ground spice stories directly with guests.")
    ]
    for h, b in menu_features:
        p_pt = tf3_l.add_paragraph()
        p_pt.text = f"• {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(10.5)
        p_pt.font.color.rgb = RGBColor(0xD6, 0xD3, 0xD1)
        p_pt.space_before = Pt(8)

    c3_right = add_card(s3, Inches(6.9), Inches(2.0), Inches(5.6), Inches(4.7), C_CHARCOAL_CARD, None)
    tb3_r = s3.shapes.add_textbox(Inches(7.2), Inches(2.3), Inches(5.0), Inches(4.1))
    tf3_r = tb3_r.text_frame
    tf3_r.word_wrap = True
    p = tf3_r.paragraphs[0]
    p.text = "Table Service Controls"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    service_pts = [
        ("1-Tap Waiter Call System", "Diners never wave their hands frantically. 1 button tap dispatches instant notification: 'Table 4 needs assistance'."),
        ("Specific Service Pings", "Dedicated quick-actions: 'Request Water', 'Request Bill', 'Clean Table' alerts floor staff immediately."),
        ("Active Order Tracking", "Guests view their live order status: 'Order Received', 'In Tandoor / Preparing', 'Served'."),
        ("Zero App Downloads", "Runs entirely inside standard mobile browsers (Safari / Chrome) via lightweight PWA architecture.")
    ]
    for h, b in service_pts:
        p_pt = tf3_r.add_paragraph()
        p_pt.text = f"✓ {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(11)
        p_pt.font.color.rgb = C_WHITE
        p_pt.space_before = Pt(12)

    # =========================================================================
    # SLIDE 4: REAL-TIME MULTIPLAYER TABLE SYNC
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, C_IVORY_BG)
    add_header(s4, "Multiplayer Collaboration", "Real-Time Table Sync: Group Dining Reimagined", "Multiple phones at the same table add dishes together into one synchronized live cart.")

    c4_items = [
        ("Live Shared Table Tray", "How It Works", "When a family or group sits at Table 4, everyone scans the QR code. All phones connect to the same shared table session via WebSockets with <100ms sync latency."),
        ("Clear Guest Attribution", "Who Ordered What", "Every dish in the cart displays the diner's identifier ('👤 Guest 1 - Host', '👤 Guest 2 - Rohan'). Eliminates confusion over who ordered what dish."),
        ("Zero Duplicate Orders", "Kitchen Efficiency", "Table reviews the unified cart together before dispatch. Eliminates disjointed orders and ensures the kitchen receives one harmonious KOT.")
    ]

    for i, (t4, sub4, d4) in enumerate(c4_items):
        left = Inches(0.8 + i * 4.0)
        add_card(s4, left, Inches(2.0), Inches(3.64), Inches(4.7), C_IVORY_CARD, C_BORDER)
        tb = s4.shapes.add_textbox(left + Inches(0.3), Inches(2.3), Inches(3.04), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t4
        p.font.name = "Georgia"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON

        p_sub = tf.add_paragraph()
        p_sub.text = sub4.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_BLUE
        p_sub.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = d4
        p2.font.name = "Arial"
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 5: CHEF & OWNER-TRAINED AI SOMMELIER
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, C_CHARCOAL_DARK)
    add_header(s5, "AI Dining Concierge", "Chef AI Sommelier: Always Answering, Auto-Scrolling", "A personalized conversational AI trained directly on your head chef's recipes and owner's upsell rules.", is_dark=True)

    add_card(s5, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.7), C_CHARCOAL_CARD, None)
    tb5 = s5.shapes.add_textbox(Inches(1.2), Inches(2.3), Inches(10.9), Inches(4.1))
    tf5 = tb5.text_frame
    tf5.word_wrap = True

    p = tf5.paragraphs[0]
    p.text = "Key Conversational Capabilities & UX Upgrades"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    chat_features = [
        ("Auto-Scroll Response UX", "When a diner taps a suggestion chip (e.g. 'Is the Butter Chicken spicy?', 'Pair a wine with Dal Makhani'), the chat window automatically follows the response so the diner reads the answer without physical scrolling."),
        ("Trained by Head Chef", "Speaks with authentic authority on secret charcoal marinades, spice calibrations, and cooking times. Zero hallucinations — answers only from your verified recipe dataset."),
        ("Trained by Restaurant Owner", "Subtly steers diners toward high-margin coolers, tandoori breads, and signature house desserts, increasing table check size naturally."),
        ("Allergy & Dietary Guarantee", "Verifies kitchen cross-contamination safety protocols for gluten-free, nut-free, and Jain requirements with 100% confidence.")
    ]
    for h, d in chat_features:
        p_cf = tf5.add_paragraph()
        p_cf.text = f"✨ {h}: {d}"
        p_cf.font.name = "Arial"
        p_cf.font.size = Pt(11.5)
        p_cf.font.color.rgb = C_WHITE
        p_cf.space_before = Pt(12)

    # =========================================================================
    # SLIDE 6: CHEF PAIRINGS & REVENUE UPSELL ENGINE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, C_IVORY_BG)
    add_header(s6, "Revenue Engine", "Smart Chef Pairings & High-Margin Upsell Engine", "Increasing average ticket sizes by +22% with contextual beverage & side bundle suggestions.")

    cards_6 = [
        ("Contextual Pairing Suggestions", "Automatic Detection", "When a diner selects Awadhi Murgh Biryani, Menuz instantly surfaces the Chef's Recommended Pairing: Garlic Butter Naan + Royal Kokum Mint Cooler."),
        ("Promotional Bundle Deals", "Owner Configurable", "Owners configure bundle discounts (e.g. 10% to 15% off when added as a pair). Diners get exciting value while the restaurant sells more drinks and desserts."),
        ("1-Click In-Tray Quick Add", "Zero Friction", "No jumping between menu categories: diners add the pairing deal in 1 tap right inside their dining cart tray with instant total recalculation.")
    ]

    for i, (t6, sub6, d6) in enumerate(cards_6):
        left = Inches(0.8 + i * 4.0)
        add_card(s6, left, Inches(2.0), Inches(3.64), Inches(4.7), C_IVORY_CARD, C_BORDER)
        tb = s6.shapes.add_textbox(left + Inches(0.3), Inches(2.3), Inches(3.04), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t6
        p.font.name = "Georgia"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON

        p_sub = tf.add_paragraph()
        p_sub.text = sub6.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_BLUE
        p_sub.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = d6
        p2.font.name = "Arial"
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 7: OWNER-CONFIGURABLE VIRAL GROWTH GATEWAY (INSTAGRAM VS GOOGLE)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7, C_IVORY_BG)
    add_header(s7, "Owner-Controlled Growth", "Reward Gateway: Instagram Story vs. Google Review", "The restaurant owner chooses how diners unlock their free food item or table discount.")

    col_w7 = Inches(5.6)
    c7_1 = add_card(s7, Inches(0.8), Inches(2.0), col_w7, Inches(4.7), C_IVORY_CARD, C_BORDER)
    tb7_1 = s7.shapes.add_textbox(Inches(1.1), Inches(2.3), col_w7 - Inches(0.6), Inches(4.1))
    tf7_1 = tb7_1.text_frame
    tf7_1.word_wrap = True
    p = tf7_1.paragraphs[0]
    p.text = "Option A: 5-Star Google Review Boost"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    g_pts = [
        "Diner drafts an AI dish-specific 5-star review.",
        "Unlocks the Lucky Wheel or 15% table discount voucher upon posting to Google Maps.",
        "Drives maximum Google SEO rank, local search discovery, and walk-in footfall.",
        "Best for: New restaurants or locations needing 500+ Google Maps reviews fast."
    ]
    for pt in g_pts:
        p_sub = tf7_1.add_paragraph()
        p_sub.text = f"⭐ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = C_CHARCOAL_DARK
        p_sub.space_before = Pt(9)

    c7_2 = add_card(s7, Inches(6.9), Inches(2.0), col_w7, Inches(4.7), C_IVORY_CARD, C_BORDER)
    tb7_2 = s7.shapes.add_textbox(Inches(7.2), Inches(2.3), col_w7 - Inches(0.6), Inches(4.1))
    tf7_2 = tb7_2.text_frame
    tf7_2.word_wrap = True
    p = tf7_2.paragraphs[0]
    p.text = "Option B: Viral Instagram Story Share"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_PINK

    i_pts = [
        "Diner generates a 9:16 vertical Instagram Story card featuring their table dish.",
        "Mentions @restaurant and location tag to unlock their free dessert or bill discount.",
        "Taps into diners' authentic local followers for massive peer-to-peer social reach.",
        "Best for: High-energy cafes, bars, rooftop lounges, and youth-centric brands."
    ]
    for pt in i_pts:
        p_sub = tf7_2.add_paragraph()
        p_sub.text = f"📸 {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = C_CHARCOAL_DARK
        p_sub.space_before = Pt(9)

    # Note at bottom
    note_box = s7.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.733), Inches(0.4))
    p_note = note_box.text_frame.paragraphs[0]
    p_note.text = "💡 Owner's Choice: Set to Google Review, Instagram Story, or Dual Mode (Diner's Choice) in 1 click from Admin Settings."
    p_note.font.name = "Arial"
    p_note.font.size = Pt(10.5)
    p_note.font.bold = True
    p_note.font.color.rgb = C_SAFFRON

    # =========================================================================
    # SLIDE 8: VIRAL 9:16 INSTAGRAM STORY STUDIO
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8, C_CHARCOAL_DARK)
    add_header(s8, "Social Growth", "Viral 9:16 Instagram Story Studio", "Turn every dish ordered into branded organic social impressions across Pune.", is_dark=True)

    add_card(s8, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.7), C_CHARCOAL_CARD, None)
    tb8 = s8.shapes.add_textbox(Inches(1.2), Inches(2.3), Inches(10.9), Inches(4.1))
    tf8 = tb8.text_frame
    tf8.word_wrap = True

    p = tf8.paragraphs[0]
    p.text = "How the 9:16 Social Story Engine Works"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    insta_details = [
        ("Automated Branded Cards", "Diners tap 'Share to Story' on any signature dish. Menuz automatically generates a professional 9:16 vertical card with the dish photo, restaurant logo, and diner quote."),
        ("Verified 5★ Sticker & Tags", "Pre-configured with @restaurant handle, location geo-tag, and 'Verified 5-Star Experience' sticker for authentic social credibility."),
        ("Direct 1-Click Sharing", "Direct integration with Instagram Stories and WhatsApp Status — zero manual editing or graphic design required by the guest."),
        ("Zero Influencer Marketing Spend", "Replaces expensive paid influencer campaigns with hundreds of genuine table diners sharing authentic dining moments every week.")
    ]
    for h, d in insta_details:
        p_id = tf8.add_paragraph()
        p_id.text = f"📱 {h}: {d}"
        p_id.font.name = "Arial"
        p_id.font.size = Pt(11.5)
        p_id.font.color.rgb = C_WHITE
        p_id.space_before = Pt(12)

    # =========================================================================
    # SLIDE 9: REPUTATION FLOOR SHIELD & REVIEW BOOSTER
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9, C_IVORY_BG)
    add_header(s9, "Reputation Management", "Public 5★ Reviews. Private Floor Intercepts.", "How Menuz channels happy diners to Google Maps while intercepting complaints silently on the floor.")

    steps_9 = [
        ("4-5★ Reviews -> Public Google Maps", "Positive diners get AI-assisted dish reviews highlighting specialty recipes and ambiance, boosting your Google search rank."),
        ("1-3★ Reviews -> Silent Manager Shield", "Ratings under 4 stars NEVER reach Google. A silent floor alert immediately buzzes the manager's tablet with table number."),
        ("Tableside Complaint Resolution", "Floor manager visits Table 4 immediately with a fresh dish or personal apology, converting an upset guest before they leave."),
        ("Zero Negative Public Footprint", "Protects your 4.8★ rating permanently while giving kitchen and management real feedback to improve service quality.")
    ]

    for i, (stitle, sdesc) in enumerate(steps_9):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 6.0)
        top = Inches(2.0 + row * 2.4)
        add_card(s9, left, top, Inches(5.6), Inches(2.2), C_IVORY_CARD, C_BORDER)

        tb = s9.shapes.add_textbox(left + Inches(0.3), top + Inches(0.25), Inches(5.0), Inches(1.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = stitle
        p.font.name = "Georgia"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON if i == 0 or i == 3 else C_BLUE

        p2 = tf.add_paragraph()
        p2.text = sdesc
        p2.font.name = "Arial"
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 10: ANTI-CHEAT VOUCHER SECURITY & GAMIFIED WHEEL
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10, C_CHARCOAL_DARK)
    add_header(s10, "Fraud Protection", "Anti-Cheat Voucher Security & Gamified Lucky Wheel", "Diners love winning table rewards — while owners are 100% protected against screenshot fraud.", is_dark=True)

    c10_l = add_card(s10, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.7), C_CHARCOAL_CARD, None)
    tb10_l = s10.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.1))
    tf10_l = tb10_l.text_frame
    tf10_l.word_wrap = True
    p = tf10_l.paragraphs[0]
    p.text = "Interactive Lucky Wheel"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    wheel_pts = [
        "Exciting visual wheel spin immediately on QR scan.",
        "Customizable prizes: 15% off food bill, free signature dessert, or mocktail upgrade.",
        "Creates instant excitement at table entry, guaranteeing diners stay and dine.",
        "Ties reward redemption directly to billing."
    ]
    for pt in wheel_pts:
        p_pt = tf10_l.add_paragraph()
        p_pt.text = f"🎉 {pt}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(11)
        p_pt.font.color.rgb = C_WHITE
        p_pt.space_before = Pt(10)

    c10_r = add_card(s10, Inches(6.9), Inches(2.0), Inches(5.6), Inches(4.7), C_CHARCOAL_CARD, None)
    tb10_r = s10.shapes.add_textbox(Inches(7.2), Inches(2.3), Inches(5.0), Inches(4.1))
    tf10_r = tb10_r.text_frame
    tf10_r.word_wrap = True
    p = tf10_r.paragraphs[0]
    p.text = "Triple Anti-Cheat Security"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    sec_pts = [
        ("Live 15-Minute Dynamic Clock", "Voucher display features a live ticking seconds countdown. Reused screenshots or static forwarded images are instantly spotted and rejected."),
        ("Waiter PIN Verification (1234)", "Server physically types PIN 1234 on diner's screen to permanently void the voucher upon billing."),
        ("Single-Use Table Lock", "Vouchers are cryptographically locked to Table X and session ID — cannot be passed around to other diners.")
    ]
    for h, b in sec_pts:
        p_pt = tf10_r.add_paragraph()
        p_pt.text = f"🔒 {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(11)
        p_pt.font.color.rgb = RGBColor(0xD6, 0xD3, 0xD1)
        p_pt.space_before = Pt(12)

    # =========================================================================
    # SLIDE 11: DIRECT KITCHEN KOT & UNIVERSAL POS BRIDGE (MODE A VS MODE B)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11, C_IVORY_BG)
    add_header(s11, "Kitchen Operations", "Direct Kitchen KOT & Universal POS Bridge", "Owner-controlled order dispatching with triple-redundant thermal printing failover.")

    col_w11 = Inches(5.6)
    c11_1 = add_card(s11, Inches(0.8), Inches(2.0), col_w11, Inches(4.7), C_IVORY_CARD, C_BORDER)
    tb11_1 = s11.shapes.add_textbox(Inches(1.1), Inches(2.3), col_w11 - Inches(0.6), Inches(4.1))
    tf11_1 = tb11_1.text_frame
    tf11_1.word_wrap = True
    p = tf11_1.paragraphs[0]
    p.text = "Mode A: Direct Auto-KOT to Kitchen"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    a_pts11 = [
        "Fires 80mm ESC/POS thermal ticket directly in kitchen in 1 second.",
        "Zero waiter re-typing — eliminates handwritten mistakes and delays.",
        "Pre-configured preparation notes (spice level, allergen notes, guest tags).",
        "Best for: High-turnover cafes, bistros, QSRs, and casual dining."
    ]
    for pt in a_pts11:
        p_sub = tf11_1.add_paragraph()
        p_sub.text = f"⚡ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = C_CHARCOAL_DARK
        p_sub.space_before = Pt(9)

    c11_2 = add_card(s11, Inches(6.9), Inches(2.0), col_w11, Inches(4.7), C_IVORY_CARD, C_BORDER)
    tb11_2 = s11.shapes.add_textbox(Inches(7.2), Inches(2.3), col_w11 - Inches(0.6), Inches(4.1))
    tf11_2 = tb11_2.text_frame
    tf11_2.word_wrap = True
    p = tf11_2.paragraphs[0]
    p.text = "Mode B: Floor Captain Review First"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    b_pts11 = [
        "Order appears on Captain / Manager Floor Tablet first for quick verification.",
        "Captain checks bar inventory, course pacing, and guest preferences.",
        "Captain taps 'Approve & Fire' to send ticket to kitchen printers.",
        "Best for: Multi-course fine dining, rooftop lounges, and banquet service."
    ]
    for pt in b_pts11:
        p_sub = tf11_2.add_paragraph()
        p_sub.text = f"👨‍✈️ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = C_CHARCOAL_DARK
        p_sub.space_before = Pt(9)

    # =========================================================================
    # SLIDE 12: FLOOR OPERATIONS HUB & KITCHEN DISPLAY SYSTEM (KDS)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12, C_CHARCOAL_DARK)
    add_header(s12, "Floor Management", "Live Floor Operations Hub & Kitchen Display (KDS)", "Real-time tablet command center for floor managers, captains, and kitchen expeditors.", is_dark=True)

    add_card(s12, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.7), C_CHARCOAL_CARD, None)
    tb12 = s12.shapes.add_textbox(Inches(1.2), Inches(2.3), Inches(10.9), Inches(4.1))
    tf12 = tb12.text_frame
    tf12.word_wrap = True

    p = tf12.paragraphs[0]
    p.text = "Comprehensive Floor Operations Capabilities"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    floor_features = [
        ("Real-Time Table Map & Status", "Live visual grid of all tables (Green = Active Dining, Amber = Ordering, Blue = Bill Requested, Gray = Vacant)."),
        ("Service Call Management", "Instant push alerts for 'Waiter Summoned', 'Water Needed', or 'Bill Requested' with response time tracking."),
        ("Kitchen Expeditor Timers", "Color-coded order preparation clocks (Green <15m, Amber 15-25m, Red >25m) prevent table food delays."),
        ("Universal POS Adapters", "Native bi-directional adapters for Petpooja (50k+ Indian outlets), RoyalPOS (Pune local), Recaho (PCMC), and RanceLab Chains, plus direct ESC/POS hardware printing.")
    ]
    for h, d in floor_features:
        p_ff = tf12.add_paragraph()
        p_ff.text = f"📟 {h}: {d}"
        p_ff.font.name = "Arial"
        p_ff.font.size = Pt(11.5)
        p_ff.font.color.rgb = C_WHITE
        p_ff.space_before = Pt(12)

    # =========================================================================
    # SLIDE 13: 5-MIN AI ONBOARDING STUDIO & MASTER MULTI-TENANCY
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13, C_IVORY_BG)
    add_header(s13, "Fast Deployment", "5-Minute AI Onboarding Studio & Multi-Tenant Platform", "Get any restaurant live in under 5 minutes with voice intake and partitioned cloud storage.")

    cards_13 = [
        ("AI Menu & Recipe Intake", "Voice & 1-Click Auto-Draft", "Chefs speak or upload a photo of the paper menu. AI auto-extracts dish names, categorizes courses, drafts flavor notes, and calibrates spice ratings in minutes."),
        ("Partitioned Media Library", "Isolated Cloud Storage", "Every partner restaurant has an isolated cloud image bank. High-res dish photography and branding are segregated permanently with zero cross-tenant clutter."),
        ("Standalone Branded Routes", "Custom URLs & Domains", "Each restaurant operates on a dedicated URL (/r/:restaurantSlug) with custom brand theme, logo, and table tokens for direct Google Maps and bio links.")
    ]

    for i, (t13, sub13, d13) in enumerate(cards_13):
        left = Inches(0.8 + i * 4.0)
        add_card(s13, left, Inches(2.0), Inches(3.64), Inches(4.7), C_IVORY_CARD, C_BORDER)
        tb = s13.shapes.add_textbox(left + Inches(0.3), Inches(2.3), Inches(3.04), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t13
        p.font.name = "Georgia"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = C_SAFFRON

        p_sub = tf.add_paragraph()
        p_sub.text = sub13.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_BLUE
        p_sub.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = d13
        p2.font.name = "Arial"
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = C_MUTED
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 14: REGIONAL INCLUSIVITY (ENGLISH PRIMARY + HINDI & MARATHI)
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14, C_IVORY_BG)
    add_header(s14, "Regional Inclusivity", "Multilingual Dining: English Primary, Hindi & Marathi", "Preserving global appeal while honoring local hospitality and regional language preference.")

    m_cards14 = [
        ("English (Default Primary)", "Strict Rule: Always First", "English is hardcoded as the primary launch language for 100% of devices. No arbitrary IP or browser locale redirection. Global diners feel instantly at home."),
        ("हिन्दी (Hindi Native)", "Physical 1-Click Toggle", "Comprehensive native translation for Starters, Main Course, Biryani, special kitchen cooking notes (खास स्वयंपाक सूचना), and kitchen dispatch."),
        ("मराठी (Marathi Native)", "Local Cultural Resonance", "Full regional translation celebrating Maharashtra's food culture (बिर्याणी, स्टार्टर्स, गोड पदार्थ, कॅप्टनला बोलवा), providing warm familiarity for family dining.")
    ]

    for i, (mtitle, msub, mdesc) in enumerate(m_cards14):
        left = Inches(0.8 + i * 4.0)
        add_card(s14, left, Inches(2.0), Inches(3.64), Inches(4.7), C_IVORY_CARD, C_BORDER)
        tb = s14.shapes.add_textbox(left + Inches(0.3), Inches(2.3), Inches(3.04), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = mtitle
        p.font.name = "Georgia"
        p.font.size = Pt(17)
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
        p_desc.font.size = Pt(11.5)
        p_desc.font.color.rgb = C_MUTED
        p_desc.space_before = Pt(14)

    # =========================================================================
    # SLIDE 15: DIRECT RESTAURANT ACCESS & 0% COMMISSION PRICING
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_bg(s15, C_CHARCOAL_DARK)
    add_header(s15, "Commercial Model", "Direct Access Onboarding (No Arbitrary Trials) & 0% Commission", "You control access directly — granting complete capabilities to partner restaurants with transparent economics.", is_dark=True)

    add_card(s15, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.7), C_CHARCOAL_CARD, None)
    tb15 = s15.shapes.add_textbox(Inches(1.2), Inches(2.3), Inches(10.9), Inches(4.1))
    tf15 = tb15.text_frame
    tf15.word_wrap = True

    p = tf15.paragraphs[0]
    p.text = "Transparent Commercial Model & Ownership"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_SAFFRON

    model_points = [
        ("Direct Access Onboarding", "Removed arbitrary 7-day trial counters. As the platform owner, you grant full operational access directly to restaurants on demand."),
        ("Flat ₹1,999 / Month Flat Subscription", "Zero commission on food sales. Restaurants keep 100% of their billing revenue — saving thousands compared to 20-30% aggregator fees."),
        ("100% Customer Data Ownership", "Restaurants own their verified customer WhatsApp numbers and dining histories for festival and weekend remarketing."),
        ("High-Durability Acrylic Stands Included", "Premium acrylic QR table stands and kitchen thermal printer configuration guides supplied on rollout.")
    ]
    for h, d in model_points:
        p_mp = tf15.add_paragraph()
        p_mp.text = f"💼 {h}: {d}"
        p_mp.font.name = "Arial"
        p_mp.font.size = Pt(11.5)
        p_mp.font.color.rgb = C_WHITE
        p_mp.space_before = Pt(12)

    # =========================================================================
    # SLIDE 16: SUMMARY, METRICS & LIVE PLATFORM
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    add_bg(s16, C_CHARCOAL_DARK)

    tb16 = s16.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.733), Inches(5.2))
    tf16 = tb16.text_frame
    tf16.word_wrap = True

    p = tf16.paragraphs[0]
    p.text = "Transform Your Restaurant with Menuz"
    p.font.name = "Georgia"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    p_sub = tf16.add_paragraph()
    p_sub.text = "Interactive Menus • Multiplayer Sync • Direct Kitchen KOT • Viral Growth • 0% Commission"
    p_sub.font.name = "Georgia"
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = C_SAFFRON
    p_sub.space_before = Pt(10)

    stats = [
        "+22% Average Ticket Value via Smart Pairings & Upsells",
        "+300 Verified 5-Star Reviews or Viral Instagram Stories Monthly",
        "Zero Lost Orders with Multi-Channel KOT Failover (Port 9100 / LAN / POS)",
        "Diner Service Response Times Cut from 10 Mins to Under 60 Seconds"
    ]
    for s in stats:
        p_stat = tf16.add_paragraph()
        p_stat.text = f"✓  {s}"
        p_stat.font.name = "Arial"
        p_stat.font.size = Pt(13.5)
        p_stat.font.color.rgb = RGBColor(0xE7, 0xE5, 0xE4)
        p_stat.space_before = Pt(9)

    p_cta = tf16.add_paragraph()
    p_cta.text = "Explore the Live Interactive Platform: stgtrgjrccx.github.io/menuz"
    p_cta.font.name = "Arial"
    p_cta.font.size = Pt(13)
    p_cta.font.bold = True
    p_cta.font.color.rgb = C_SAFFRON_LIGHT
    p_cta.space_before = Pt(18)

    # Save
    prs.save(output_pptx_path)
    print(f"Successfully created presentation with {len(prs.slides)} slides: {output_pptx_path}")

if __name__ == "__main__":
    out_dir = os.path.join(os.getcwd(), 'public')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'menuz_executive_pitch_deck.pptx')
    create_deck(out_file)
