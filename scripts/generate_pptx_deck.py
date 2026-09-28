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

    # ═════════════════════════════════════════════════════════════════════════
    # NEW BRAND IDENTITY: MIDNIGHT OBSIDIAN & ELECTRIC AMBER-CYAN LUXE PALETTE
    # ═════════════════════════════════════════════════════════════════════════
    C_MIDNIGHT_BG = RGBColor(0x09, 0x0D, 0x16)     # #090D16 Deep Obsidian Navy
    C_CARD_BG = RGBColor(0x13, 0x1C, 0x2E)         # #131C2E Rich Frosted Slate Card
    C_CARD_ALT = RGBColor(0x18, 0x24, 0x3B)        # #18243B Elevated Feature Card
    
    # Electric Accent Highlights
    C_GOLD_ACCENT = RGBColor(0xF5, 0x9E, 0x0B)     # #F59E0B Radiant Amber Gold
    C_CYAN_ACCENT = RGBColor(0x06, 0xB6, 0xD4)     # #06B6D4 Electric Cyan
    C_EMERALD_NEON = RGBColor(0x10, 0xB9, 0x81)    # #10B981 Vivid Emerald Green
    C_ROSE_NEON = RGBColor(0xF4, 0x3F, 0x5E)       # #F43F5E Cyber Rose / Instagram
    C_VIOLET_NEON = RGBColor(0x8B, 0x5C, 0xF6)     # #8B5CF6 Royal Violet
    
    # Crisp Typography Tones
    C_TEXT_WHITE = RGBColor(0xFA, 0xFA, 0xFA)      # #FAFAFA Pure Titanium White
    C_TEXT_SUB = RGBColor(0xCB, 0xD5, 0xE1)        # #CBD5E1 High-Contrast Ice Slate
    C_TEXT_MUTED = RGBColor(0x94, 0xA3, 0xB8)      # #94A3B8 Secondary Gray
    
    # Subtle Neon Glowing Borders
    C_BORDER_CYAN = RGBColor(0x08, 0x91, 0xB2)     # #0891B2
    C_BORDER_GOLD = RGBColor(0xD9, 0x77, 0x06)     # #D97706
    C_BORDER_SLATE = RGBColor(0x27, 0x36, 0x4F)    # #27364F

    def add_bg(slide, color=C_MIDNIGHT_BG):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text=None, tag_color=C_CYAN_ACCENT):
        # Pill Tag (Neon Tech Aesthetic)
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.7), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_right = tf_tag.margin_top = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = f"// {tag_text.upper()}"
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(13)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color

        # Main Title (Massive Bold 28pt)
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Georgia"
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT_WHITE

        if subtitle_text:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.7), Inches(0.5))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_right = tf_sub.margin_top = tf_sub.margin_bottom = 0
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(14)
            p_sub.font.color.rgb = C_TEXT_SUB

    def add_card(slide, left, top, width, height, bg_color=C_CARD_BG, border_color=C_BORDER_SLATE):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: COVER SLIDE (MIDNIGHT OBSIDIAN & GOLD LUXURY)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, C_MIDNIGHT_BG)

    # Gradient-style glowing bar
    bar1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.8), Inches(0.1))
    bar1.fill.solid()
    bar1.fill.fore_color.rgb = C_GOLD_ACCENT
    bar1.line.fill.background()

    bar2 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.65), Inches(1.2), Inches(0.8), Inches(0.1))
    bar2.fill.solid()
    bar2.fill.fore_color.rgb = C_CYAN_ACCENT
    bar2.line.fill.background()

    s1_title_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(1.8))
    tf1 = s1_title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "MENUZ"
    p1.font.name = "Georgia"
    p1.font.size = Pt(64)
    p1.font.bold = True
    p1.font.color.rgb = C_TEXT_WHITE

    p1_sub = tf1.add_paragraph()
    p1_sub.text = "The Modern Dine-In Operating System & Growth Engine"
    p1_sub.font.name = "Georgia"
    p1_sub.font.size = Pt(28)
    p1_sub.font.bold = True
    p1_sub.font.color.rgb = C_GOLD_ACCENT
    p1_sub.space_before = Pt(8)

    s1_desc_box = s1.shapes.add_textbox(Inches(0.8), Inches(3.7), Inches(11.7), Inches(2.7))
    tf1_desc = s1_desc_box.text_frame
    tf1_desc.word_wrap = True

    bullets1 = [
        ("Interactive HD Menus & Live Table Sync", "Diners co-order in real time (<100ms sync) with zero app downloads.", C_CYAN_ACCENT),
        ("Chef AI Sommelier & Pairings", "Contextual drink and dessert recommendations drive +22% average check sizes.", C_GOLD_ACCENT),
        ("Reputation Floor Shield", "Channels 5★ reviews to Google while intercepting 1-3★ table grievances in <60s.", C_EMERALD_NEON),
        ("Direct Kitchen KOT & POS Integration", "Owner-controlled 1-sec auto-KOT or captain review; syncs with Petpooja & RoyalPOS.", C_VIOLET_NEON),
        ("Commercial Model", "Flat ₹1,999/mo, 0% commission, and 100% customer WhatsApp data ownership.", C_GOLD_ACCENT)
    ]
    for h, b, col in bullets1:
        p_b = tf1_desc.add_paragraph()
        p_b.text = f"⚡  {h}: {b}"
        p_b.font.name = "Arial"
        p_b.font.size = Pt(14)
        p_b.font.color.rgb = C_TEXT_SUB
        p_b.space_before = Pt(8)

    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.7), Inches(11.7), Inches(0.4))
    tf_meta = meta_box.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "EXECUTIVE PARTNERSHIP SPECIFICATION • 15 RESTAURANT VALIDATION EDITION • MENUZ"
    p_meta.font.name = "Arial"
    p_meta.font.size = Pt(11)
    p_meta.font.bold = True
    p_meta.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 2: THE MODERN DINE-IN CRISIS
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Industry Challenge", "The 4 Critical Operational Traps Bleeding Restaurant Profits", "Why traditional paper menus, delivery aggregators, and unmanaged public reviews harm dining revenue.", tag_color=C_ROSE_NEON)

    pain_points = [
        ("1. Aggregator Commission Trap (25-30%)", "Delivery platforms charge crippling commissions and withhold customer phone numbers, preventing direct remarketing.", C_ROSE_NEON),
        ("2. Paper Menu Blindness", "Static paper menus fail to upsell drinks or show plating. Updating single dish prices requires expensive re-printing and days of delay.", C_GOLD_ACCENT),
        ("3. The 1-Star Google Ambush", "Diners leave quietly and post devastating 1-star Google reviews from home at 11 PM, permanently lowering your SEO rank and footfall.", C_ROSE_NEON),
        ("4. Waiter Dispatch Bottlenecks", "Guests wave hands frantically for water or bills during peak rush. Table turnover slows by 15-20 minutes, costing thousands in lost seatings.", C_CYAN_ACCENT)
    ]

    for i, (ctitle, cdesc, col) in enumerate(pain_points):
        row = i // 2
        col_idx = i % 2
        left = Inches(0.8 + col_idx * 6.0)
        top = Inches(2.0 + row * 2.5)
        add_card(s2, left, top, Inches(5.7), Inches(2.3), C_CARD_BG, C_BORDER_SLATE)

        tb = s2.shapes.add_textbox(left + Inches(0.3), top + Inches(0.25), Inches(5.1), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = ctitle
        p.font.name = "Georgia"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = cdesc
        p2.font.name = "Arial"
        p2.font.size = Pt(13.5)
        p2.font.color.rgb = C_TEXT_SUB
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: FACTUAL MARKETING MATRIX
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Factual Marketing Matrix", "Public Google Reviews vs. Instagram UGC vs. Floor Shield", "Understanding the distinct roles of Google Search, Social Media Virality, and Table Damage Control.", tag_color=C_CYAN_ACCENT)

    matrix_cols = [
        ("A. Public Google Reviews", "SEO & Search Footfall", C_GOLD_ACCENT, C_BORDER_GOLD, [
            "Platform: Google Maps / Local 3-Pack.",
            "Format: Permanent star score + text review.",
            "Impact: Dictates organic rank for high-intent searches ('best cafe near me') and walk-ins.",
            "Menuz Role: Multiplies 5★ reviews via 1-tap AI drafts and gamified Lucky Wheel rewards."
        ]),
        ("B. Instagram / Social UGC", "Visual Virality & Hype", C_ROSE_NEON, C_BORDER_SLATE, [
            "Platform: Instagram Stories & Reels.",
            "Format: 9:16 Vertical branded dish cards.",
            "Impact: Reaches 500-2,000 local friends of the guest, creating visual FOMO and viral buzz.",
            "Menuz Role: Generates instant 9:16 story cards with @restaurant tag in 1 tap."
        ]),
        ("C. Private Floor Shield", "Table Damage Control", C_EMERALD_NEON, C_BORDER_CYAN, [
            "Platform: Internal Manager Tablet / SMS.",
            "Format: Private 1-3★ table grievance alert.",
            "Impact: Stops complaints from reaching Google; alerts floor manager in <60s.",
            "Menuz Role: Manager resolves issue at table before guest ever leaves."
        ])
    ]

    for i, (col_title, col_sub, col_color, col_border, col_bullets) in enumerate(matrix_cols):
        left = Inches(0.8 + i * 4.0)
        add_card(s3, left, Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, col_border)

        tb = s3.shapes.add_textbox(left + Inches(0.25), Inches(2.2), Inches(3.2), Inches(4.6))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = col_title
        p.font.name = "Georgia"
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = col_color

        p_sub = tf.add_paragraph()
        p_sub.text = col_sub.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_CYAN_ACCENT if i == 0 else C_TEXT_MUTED
        p_sub.space_before = Pt(4)

        for b in col_bullets:
            p_b = tf.add_paragraph()
            p_b.text = f"• {b}"
            p_b.font.name = "Arial"
            p_b.font.size = Pt(13)
            p_b.font.color.rgb = C_TEXT_SUB
            p_b.space_before = Pt(10)

    # =========================================================================
    # SLIDE 4: VISUAL DIGITAL MENU & SERVICE CONTROLS
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Diner Interface", "Visual Digital Menu: Engaging Appetites with Culinary Storytelling", "Replacing paper text with high-res plating photos, calibrated spice meters, and instant service calls.", tag_color=C_CYAN_ACCENT)

    c4_l = add_card(s4, Inches(0.8), Inches(2.0), Inches(5.7), Inches(5.0), C_CARD_BG, C_BORDER_CYAN)
    tb4_l = s4.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(5.1), Inches(4.5))
    tf4_l = tb4_l.text_frame
    tf4_l.word_wrap = True
    p = tf4_l.paragraphs[0]
    p.text = "Visual Menu Features"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_CYAN_ACCENT

    menu_features = [
        ("High-Resolution Plating Photos", "Showcases exact culinary presentations, triggering immediate visual appetite and premium orders."),
        ("Spice Meter Calibration (1 to 5)", "Visual heat indicators (Level 1: Cashew Cream, Level 5: Guntur Chili) prevent spice mismatches."),
        ("Dietary & Allergen Filtering", "Instant 1-tap toggling for Pure Veg (🟢), Non-Veg (🔴), Vegan, Jain, and Gluten-Free dishes."),
        ("Chef's Secret Notes & Lore", "Shares slow-braising times, tandoor techniques, and masala histories directly with diners.")
    ]
    for h, b in menu_features:
        p_pt = tf4_l.add_paragraph()
        p_pt.text = f"• {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = C_TEXT_SUB
        p_pt.space_before = Pt(10)

    c4_r = add_card(s4, Inches(6.8), Inches(2.0), Inches(5.7), Inches(5.0), C_CARD_BG, C_BORDER_GOLD)
    tb4_r = s4.shapes.add_textbox(Inches(7.1), Inches(2.25), Inches(5.1), Inches(4.5))
    tf4_r = tb4_r.text_frame
    tf4_r.word_wrap = True
    p = tf4_r.paragraphs[0]
    p.text = "Table Service Controls"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT

    service_pts = [
        ("Zero App Downloads", "Runs instantly inside Safari or Chrome upon scanning table QR code via lightweight PWA."),
        ("1-Tap Floor Service SOS", "Diners tap 'Call Waiter', 'Water', or 'Bill'. Waiter tablet buzzes instantly with exact table number."),
        ("Live Kitchen Preparation Tracking", "Guests track order progress: 'Received' → 'In Tandoor / Preparing' → 'Served'."),
        ("Instant Itemized Bill View", "Guests view transparent bills with taxes and discounts clearly displayed, cutting checkout wait times.")
    ]
    for h, b in service_pts:
        p_pt = tf4_r.add_paragraph()
        p_pt.text = f"✓ {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = C_TEXT_WHITE
        p_pt.space_before = Pt(10)

    # =========================================================================
    # SLIDE 5: REAL-TIME MULTIPLAYER TABLE SYNC
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Group Dining Innovation", "Real-Time Multiplayer Table Sync: Group Dining Reimagined", "Multiple phones at the same table add dishes together into one synchronized live cart.", tag_color=C_CYAN_ACCENT)

    c5_items = [
        ("Live Shared Tray (<100ms)", "Instant Connection", C_CYAN_ACCENT, "All guests at Table 4 connect to the same real-time WebSocket room. When Rohan adds Butter Naan, Priya sees it on her screen in milliseconds."),
        ("Guest Attribution Tags", "Who Ordered What", C_GOLD_ACCENT, "Every item displays who ordered it ('👤 Rohan', '👤 Priya'), eliminating the awkward confusion of duplicate orders."),
        ("Harmonious Kitchen KOT", "Zero Disjointed Orders", C_EMERALD_NEON, "The table reviews the unified cart together before dispatching, ensuring the kitchen receives one organized ticket.")
    ]

    for i, (t5, sub5, col_h, d5) in enumerate(c5_items):
        left = Inches(0.8 + i * 4.0)
        add_card(s5, left, Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
        tb = s5.shapes.add_textbox(left + Inches(0.25), Inches(2.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t5
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = col_h

        p_sub = tf.add_paragraph()
        p_sub.text = sub5.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_TEXT_MUTED
        p_sub.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = d5
        p2.font.name = "Arial"
        p2.font.size = Pt(13.5)
        p2.font.color.rgb = C_TEXT_SUB
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 6: CHEF & OWNER-TRAINED AI SOMMELIER
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "AI Dining Concierge", "Chef AI Sommelier: Always Guiding Choices & Answering Questions", "A conversational AI trained directly on your chef's recipes and owner's upsell rules.", tag_color=C_GOLD_ACCENT)

    add_card(s6, Inches(0.8), Inches(2.0), Inches(11.7), Inches(5.0), C_CARD_BG, C_BORDER_GOLD)
    tb6 = s6.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(11.1), Inches(4.5))
    tf6 = tb6.text_frame
    tf6.word_wrap = True

    p = tf6.paragraphs[0]
    p.text = "How the In-Menu AI Concierge Drives Higher Check Sizes"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT

    chat_features = [
        ("Trained on Head Chef's Recipes", "Speaks with authentic authority on hand-ground spice blends, slow-braising methods, and heat levels with zero hallucinations."),
        ("Trained on Owner's Upsell Playbook", "When a diner asks what to pair with Biryani, the AI naturally suggests high-margin coolers, specialty naans, and house dessert specials."),
        ("Smart Auto-Scroll & Suggestion Chips", "Diners tap quick chips ('Pair a drink with Paneer Tikka', 'Is Mutton Curry spicy?'). The chat window smoothly auto-scrolls to the answer without typing."),
        ("Strict Dietary & Allergen Guarantee", "Instantly verifies kitchen safety protocols for Jain, nut-free, vegan, and gluten-free items with 100% confidence.")
    ]
    for h, d in chat_features:
        p_cf = tf6.add_paragraph()
        p_cf.text = f"✨ {h}: {d}"
        p_cf.font.name = "Arial"
        p_cf.font.size = Pt(13.5)
        p_cf.font.color.rgb = C_TEXT_SUB
        p_cf.space_before = Pt(12)

    # =========================================================================
    # SLIDE 7: CHEF PAIRINGS & REVENUE UPSELL ENGINE
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "Revenue Acceleration", "Smart Chef Pairings: Boosting Average Ticket Size by +22%", "Automated contextual beverage and side bundle recommendations served right inside the cart.", tag_color=C_EMERALD_NEON)

    cards_7 = [
        ("Contextual Dish Matching", "Intelligent Pairing", C_CYAN_ACCENT, "Selecting Awadhi Murgh Biryani automatically surfaces the Chef's Pairing: Garlic Butter Naan + Royal Kokum Mint Cooler in 1 tap."),
        ("Configurable Bundle Deals", "Owner Profit Control", C_GOLD_ACCENT, "Owners configure bundle discounts (e.g. 10-15% off when added as a pair). Diners love the value while restaurants sell more beverages and desserts."),
        ("1-Click In-Tray Quick Add", "Zero Category Hopping", C_EMERALD_NEON, "Suggested pairings appear right inside the bottom cart sheet so diners add them instantly without browsing separate menu categories.")
    ]

    for i, (t7, sub7, col_h, d7) in enumerate(cards_7):
        left = Inches(0.8 + i * 4.0)
        add_card(s7, left, Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
        tb = s7.shapes.add_textbox(left + Inches(0.25), Inches(2.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t7
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = col_h

        p_sub = tf.add_paragraph()
        p_sub.text = sub7.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_TEXT_MUTED
        p_sub.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = d7
        p2.font.name = "Arial"
        p2.font.size = Pt(13.5)
        p2.font.color.rgb = C_TEXT_SUB
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 8: THE REPUTATION FLOOR SHIELD
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "Reputation Defense", "The Reputation Floor Shield: 5★ to Google, 1-3★ to Manager", "How Menuz channels positive reviews to Google Maps while intercepting complaints table-side.", tag_color=C_EMERALD_NEON)

    steps_8 = [
        ("4-5★ Ratings -> Public Google Maps Multiplier", "Delighted diners receive AI-generated dish-specific review drafts and are deep-linked straight to your Google Maps review page in 1 tap.", C_GOLD_ACCENT),
        ("1-3★ Ratings -> Silent Manager SOS Alert", "Ratings under 4 stars NEVER touch Google Maps or social media. An urgent alert buzzes the manager's tablet: 'Table 4: Soup lukewarm'.", C_CYAN_ACCENT),
        ("Tableside Recovery in <60 Seconds", "Floor manager visits Table 4 immediately with a fresh replacement or complimentary chef dessert, converting an upset guest before they leave.", C_EMERALD_NEON),
        ("Permanent 4.8+ Google Rating Protection", "Guarantees your public Google rating stays high, driving continuous organic search traffic while giving kitchen staff honest feedback.", C_GOLD_ACCENT)
    ]

    for i, (stitle, sdesc, col_h) in enumerate(steps_8):
        row = i // 2
        col_idx = i % 2
        left = Inches(0.8 + col_idx * 6.0)
        top = Inches(2.0 + row * 2.5)
        add_card(s8, left, top, Inches(5.7), Inches(2.3), C_CARD_BG, C_BORDER_SLATE)

        tb = s8.shapes.add_textbox(left + Inches(0.3), top + Inches(0.25), Inches(5.1), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = stitle
        p.font.name = "Georgia"
        p.font.size = Pt(16.5)
        p.font.bold = True
        p.font.color.rgb = col_h

        p2 = tf.add_paragraph()
        p2.text = sdesc
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.color.rgb = C_TEXT_SUB
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 9: PUBLIC GOOGLE MAPS SEO ENGINE
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "Search Dominance", "Google Maps 3-Pack Dominance & AI Review Multiplication", "Turn every happy dining table into a high-ranking Google SEO asset.", tag_color=C_GOLD_ACCENT)

    add_card(s9, Inches(0.8), Inches(2.0), Inches(11.7), Inches(5.0), C_CARD_BG, C_BORDER_GOLD)
    tb9 = s9.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(11.1), Inches(4.5))
    tf9 = tb9.text_frame
    tf9.word_wrap = True

    p = tf9.paragraphs[0]
    p.text = "How Menuz Powers Local Search Discovery on Google"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT

    g_points = [
        ("AI Dish-Specific Review Drafts", "Diners hate typing reviews. Menuz's AI creates authentic 2-sentence reviews highlighting dishes they actually ordered in 1 tap."),
        ("1-Tap Deep Linking to Google Maps", "Copies the draft to clipboard and opens your exact Google Place Review page so diners paste and submit in 3 seconds."),
        ("Rich Local Keyword Injection for SEO", "Reviews naturally incorporate high-intent search keywords ('best butter chicken in Koregaon Park'), ranking your restaurant in Google's Top 3 Pack."),
        ("+300 Verified Google Reviews Monthly", "A 20-table restaurant serving 100 tables/day averages 10-15 new 5-star Google reviews daily with Menuz's spin wheel incentive.")
    ]
    for h, d in g_points:
        p_g = tf9.add_paragraph()
        p_g.text = f"⭐ {h}: {d}"
        p_g.font.name = "Arial"
        p_g.font.size = Pt(13.5)
        p_g.font.color.rgb = C_TEXT_SUB
        p_g.space_before = Pt(12)

    # =========================================================================
    # SLIDE 10: VIRAL 9:16 INSTAGRAM STORY STUDIO
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "Social Virality", "Viral 9:16 Instagram Story Studio: Organic Word-of-Mouth", "Empower diners to share gorgeous, branded dish stories to thousands of local followers.", tag_color=C_ROSE_NEON)

    add_card(s10, Inches(0.8), Inches(2.0), Inches(11.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
    tb10 = s10.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(11.1), Inches(4.5))
    tf10 = tb10.text_frame
    tf10.word_wrap = True

    p = tf10.paragraphs[0]
    p.text = "How the 9:16 Visual Social Engine Drives Virality"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_ROSE_NEON

    insta_points = [
        ("Automated 9:16 Vertical Story Cards", "Diners tap 'Share to Story'. Menuz generates a studio-grade 9:16 card featuring the ordered dish, your restaurant logo, and custom styling in seconds."),
        ("Pre-Configured @Handle & Location Tags", "Includes your exact Instagram handle (@restaurantname) and geo-location tag so their followers can tap directly into your profile."),
        ("Zero Paid Influencer Costs", "Replaces expensive paid food bloggers with 200+ authentic local diners posting real dining stories every week to their friends and colleagues."),
        ("Owner Choice: Dual Mode (Google + Instagram)", "Owners can set their reward unlock requirement to Google Review, Instagram Story, or allow diners to choose their preferred method.")
    ]
    for h, d in insta_points:
        p_i = tf10.add_paragraph()
        p_i.text = f"📸 {h}: {d}"
        p_i.font.name = "Arial"
        p_i.font.size = Pt(13.5)
        p_i.font.color.rgb = C_TEXT_SUB
        p_i.space_before = Pt(12)

    # =========================================================================
    # SLIDE 11: GAMIFIED LUCKY WHEEL & ANTI-CHEAT SECURITY
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "Fraud Protection", "Gamified Lucky Wheel & Triple-Layer Anti-Cheat Security", "Diners love winning table rewards — while owners remain 100% protected against voucher fraud.", tag_color=C_CYAN_ACCENT)

    c11_l = add_card(s11, Inches(0.8), Inches(2.0), Inches(5.7), Inches(5.0), C_CARD_BG, C_BORDER_GOLD)
    tb11_l = s11.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(5.1), Inches(4.5))
    tf11_l = tb11_l.text_frame
    tf11_l.word_wrap = True
    p = tf11_l.paragraphs[0]
    p.text = "Interactive Lucky Wheel"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT

    wheel_pts = [
        "Exciting animated spin wheel unlocked after review or social post.",
        "Customizable prizes: 15% off food bill, free dessert, or mocktail upgrade.",
        "Creates playful dining excitement, guaranteeing high table engagement.",
        "Ties reward redemption directly to final billing."
    ]
    for pt in wheel_pts:
        p_pt = tf11_l.add_paragraph()
        p_pt.text = f"🎉 {pt}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = C_TEXT_SUB
        p_pt.space_before = Pt(10)

    c11_r = add_card(s11, Inches(6.8), Inches(2.0), Inches(5.7), Inches(5.0), C_CARD_BG, C_BORDER_CYAN)
    tb11_r = s11.shapes.add_textbox(Inches(7.1), Inches(2.25), Inches(5.1), Inches(4.5))
    tf11_r = tb11_r.text_frame
    tf11_r.word_wrap = True
    p = tf11_r.paragraphs[0]
    p.text = "Triple Anti-Cheat Security"
    p.font.name = "Georgia"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_CYAN_ACCENT

    sec_pts = [
        ("Live 15-Minute Ticking Clock", "Voucher display features a live dynamic seconds clock. Static screenshots or forwarded images are instantly rejected."),
        ("Waiter PIN Verification (1234)", "Server physically enters secret PIN 1234 on diner's phone to permanently void the voucher upon billing."),
        ("Single-Use Session Lock", "Vouchers are cryptographically tied to Table X and session ID — cannot be transferred to other tables.")
    ]
    for h, b in sec_pts:
        p_pt = tf11_r.add_paragraph()
        p_pt.text = f"🔒 {h}: {b}"
        p_pt.font.name = "Arial"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = C_TEXT_SUB
        p_pt.space_before = Pt(10)

    # =========================================================================
    # SLIDE 12: KITCHEN OPERATIONS (MODE A VS MODE B)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "Kitchen Operations", "Direct Kitchen KOT & Universal POS Bridge (Mode A vs Mode B)", "Owner-controlled dispatching with thermal printer hardware compatibility.", tag_color=C_CYAN_ACCENT)

    col_w12 = Inches(5.7)
    c12_1 = add_card(s12, Inches(0.8), Inches(2.0), col_w12, Inches(5.0), C_CARD_BG, C_BORDER_CYAN)
    tb12_1 = s12.shapes.add_textbox(Inches(1.1), Inches(2.25), col_w12 - Inches(0.5), Inches(4.5))
    tf12_1 = tb12_1.text_frame
    tf12_1.word_wrap = True
    p = tf12_1.paragraphs[0]
    p.text = "Mode A: Direct Auto-KOT to Kitchen"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_CYAN_ACCENT

    a_pts12 = [
        "Fires 80mm ESC/POS thermal ticket directly to kitchen printer in 1 second.",
        "Zero waiter re-typing — eliminates manual transcription errors and delays.",
        "Pre-formatted with special instructions (spice calibration, allergen tags).",
        "Best for: High-turnover cafes, bistros, QSRs, and casual dining outlets."
    ]
    for pt in a_pts12:
        p_sub = tf12_1.add_paragraph()
        p_sub.text = f"⚡ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(13)
        p_sub.font.color.rgb = C_TEXT_SUB
        p_sub.space_before = Pt(10)

    c12_2 = add_card(s12, Inches(6.8), Inches(2.0), col_w12, Inches(5.0), C_CARD_BG, C_BORDER_GOLD)
    tb12_2 = s12.shapes.add_textbox(Inches(7.1), Inches(2.25), col_w12 - Inches(0.5), Inches(4.5))
    tf12_2 = tb12_2.text_frame
    tf12_2.word_wrap = True
    p = tf12_2.paragraphs[0]
    p.text = "Mode B: Floor Captain Review First"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT

    b_pts12 = [
        "Order lands on Floor Captain's tablet first for review and verification.",
        "Captain checks bar inventory, course pacing, and custom requests.",
        "Captain taps 'Approve & Fire' to send KOT to kitchen thermal stations.",
        "Best for: Fine dining, multi-course experiences, and rooftop lounges."
    ]
    for pt in b_pts12:
        p_sub = tf12_2.add_paragraph()
        p_sub.text = f"👨‍✈️ {pt}"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(13)
        p_sub.font.color.rgb = C_TEXT_SUB
        p_sub.space_before = Pt(10)

    # =========================================================================
    # SLIDE 13: LIVE FLOOR COMMAND CENTER & KDS
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "Operations Hub", "Live Floor Command Center & Kitchen Display System (KDS)", "Real-time tablet management for managers, floor captains, and kitchen expeditors.", tag_color=C_CYAN_ACCENT)

    add_card(s13, Inches(0.8), Inches(2.0), Inches(11.7), Inches(5.0), C_CARD_BG, C_BORDER_CYAN)
    tb13 = s13.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(11.1), Inches(4.5))
    tf13 = tb13.text_frame
    tf13.word_wrap = True

    p = tf13.paragraphs[0]
    p.text = "Real-Time Operational Controls for Floor Staff & Kitchen"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_CYAN_ACCENT

    floor_features = [
        ("Live Visual Table Map & Status Grid", "Color-coded table grid (🟢 Green = Dining, 🟡 Amber = Ordering, 🔵 Blue = Bill Requested, ⚪ Gray = Vacant)."),
        ("Service Call Management with Timers", "Instant push notifications for 'Waiter Summoned', 'Water Needed', or 'Bill Requested' with timer tracking to maintain 60-second service speed."),
        ("Kitchen Expeditor Timers (KDS)", "Visual countdown clocks on kitchen screens (Green <15m, Amber 15-25m, Red >25m) eliminate neglected orders and table delays."),
        ("Universal POS Adapters", "Native bi-directional bridging with Petpooja (50,000+ Indian outlets), RoyalPOS, Recaho, and RanceLab, plus direct network ESC/POS thermal printing.")
    ]
    for h, d in floor_features:
        p_ff = tf13.add_paragraph()
        p_ff.text = f"📟 {h}: {d}"
        p_ff.font.name = "Arial"
        p_ff.font.size = Pt(13.5)
        p_ff.font.color.rgb = C_TEXT_SUB
        p_ff.space_before = Pt(12)

    # =========================================================================
    # SLIDE 14: 5-MIN AI ONBOARDING & PARTITIONED MULTI-TENANCY
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)
    add_header(s14, "Rapid Setup", "5-Minute AI Onboarding Studio & Partitioned Multi-Tenancy", "Get any restaurant live in under 5 minutes with voice intake and isolated cloud storage.", tag_color=C_GOLD_ACCENT)

    cards_14 = [
        ("AI Menu & Recipe Intake", "Voice & Photo Auto-Draft", C_CYAN_ACCENT, "Chefs speak or upload a photo of the paper menu. AI extracts dish names, categorizes courses, drafts flavor notes, and calibrates spice ratings in minutes."),
        ("Partitioned Media Library", "Isolated Cloud Storage", C_GOLD_ACCENT, "Every partner restaurant has an isolated cloud image bank. High-res dish photography and branding are segregated with zero cross-tenant clutter."),
        ("Standalone Branded Routes", "Custom URLs & Domains", C_EMERALD_NEON, "Each restaurant operates on a dedicated URL (/r/:restaurantSlug) with custom brand theme, logo, and table tokens for direct Google Maps and bio links.")
    ]

    for i, (t14, sub14, col_h, d14) in enumerate(cards_14):
        left = Inches(0.8 + i * 4.0)
        add_card(s14, left, Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
        tb = s14.shapes.add_textbox(left + Inches(0.25), Inches(2.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = t14
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = col_h

        p_sub = tf.add_paragraph()
        p_sub.text = sub14.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_TEXT_MUTED
        p_sub.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = d14
        p2.font.name = "Arial"
        p2.font.size = Pt(13.5)
        p2.font.color.rgb = C_TEXT_SUB
        p2.space_before = Pt(14)

    # =========================================================================
    # SLIDE 15: REGIONAL INCLUSIVITY (ENGLISH PRIMARY + HINDI & MARATHI)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_bg(s15)
    add_header(s15, "Multilingual Hospitality", "Regional Inclusivity: English Primary with Hindi & Marathi", "Preserving global appeal while honoring local hospitality and regional language preferences.", tag_color=C_CYAN_ACCENT)

    m_cards15 = [
        ("English (Default Primary)", "Strict Rule: Always First", C_GOLD_ACCENT, "English is hardcoded as the primary launch language for 100% of devices. No arbitrary IP or browser locale redirection. Global and tech-savvy diners feel instantly at home."),
        ("हिन्दी (Hindi Native)", "Physical 1-Click Toggle", C_CYAN_ACCENT, "Comprehensive native translation for Starters, Main Course, Biryani, special kitchen cooking notes (खास स्वयंपाक सूचना), and kitchen dispatch."),
        ("मराठी (Marathi Native)", "Local Cultural Resonance", C_EMERALD_NEON, "Full regional translation celebrating Maharashtra's food culture (बिर्याणी, स्टार्टर्स, गोड पदार्थ, कॅप्टनला बोलवा), providing warm familiarity for family dining.")
    ]

    for i, (mtitle, msub, col_h, mdesc) in enumerate(m_cards15):
        left = Inches(0.8 + i * 4.0)
        add_card(s15, left, Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
        tb = s15.shapes.add_textbox(left + Inches(0.25), Inches(2.25), Inches(3.2), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = mtitle
        p.font.name = "Georgia"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = col_h

        p_sub = tf.add_paragraph()
        p_sub.text = msub.upper()
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = C_TEXT_MUTED
        p_sub.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = mdesc
        p_desc.font.name = "Arial"
        p_desc.font.size = Pt(13.5)
        p_desc.font.color.rgb = C_TEXT_SUB
        p_desc.space_before = Pt(14)

    # =========================================================================
    # SLIDE 16: COMMERCIAL MODEL & DIRECT ACCESS
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    add_bg(s16)
    add_header(s16, "Commercial Model", "Flat ₹1,999/Month • 0% Commission • 100% Data Ownership", "Transparent pricing with no arbitrary trial limitations or revenue deductions.", tag_color=C_GOLD_ACCENT)

    add_card(s16, Inches(0.8), Inches(2.0), Inches(11.7), Inches(5.0), C_CARD_BG, C_BORDER_GOLD)
    tb16 = s16.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(11.1), Inches(4.5))
    tf16 = tb16.text_frame
    tf16.word_wrap = True

    p = tf16.paragraphs[0]
    p.text = "Why Restaurant Owners Choose Menuz over Delivery Aggregators"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT

    model_points = [
        ("Direct Access Onboarding (No Arbitrary Trial Timers)", "As platform owner, you grant full, unrestricted operational access directly to partner restaurants upon partnership."),
        ("Flat ₹1,999 / Month Flat Subscription", "Zero commission on food sales. Restaurants keep 100% of their billing revenue — saving ₹30,000 to ₹80,000 monthly compared to aggregator commissions."),
        ("100% Customer WhatsApp Data Ownership", "Restaurants own their verified customer phone numbers and dining histories for targeted festival and weekend remarketing campaigns."),
        ("High-Durability Acrylic QR Stands Included", "Premium acrylic QR table stands and kitchen thermal printer configuration guides supplied on rollout.")
    ]
    for h, d in model_points:
        p_mp = tf16.add_paragraph()
        p_mp.text = f"💼 {h}: {d}"
        p_mp.font.name = "Arial"
        p_mp.font.size = Pt(13.5)
        p_mp.font.color.rgb = C_TEXT_SUB
        p_mp.space_before = Pt(12)

    # =========================================================================
    # SLIDE 17: 15-RESTAURANT BOARDROOM VALIDATION & STRESS TEST
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    add_bg(s17)
    add_header(s17, "Market Validation", "The 15-Restaurant Boardroom Stress Test: Unanimous Approval", "How Menuz addresses the toughest operational objections across diverse dining formats.", tag_color=C_CYAN_ACCENT)

    c17_1 = add_card(s17, Inches(0.8), Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
    tb17_1 = s17.shapes.add_textbox(Inches(1.05), Inches(2.2), Inches(3.2), Inches(4.6))
    tf17_1 = tb17_1.text_frame
    tf17_1.word_wrap = True
    p = tf17_1.paragraphs[0]
    p.text = "Cafes & High-Turnover"
    p.font.name = "Georgia"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = C_CYAN_ACCENT
    p_sub1 = tf17_1.add_paragraph()
    p_sub1.text = "German Bakery, Le Plaisir, Vaishali"
    p_sub1.font.name = "Arial"
    p_sub1.font.size = Pt(10.5)
    p_sub1.font.bold = True
    p_sub1.font.color.rgb = C_TEXT_MUTED
    p_sub1.space_before = Pt(2)
    cafe_res = [
        "Objection: 'We serve 200+ tables/day, tech must be instant.'",
        "Solution: Zero app downloads. Mode A fires direct 80mm KOT in 1s.",
        "Outcome: Table turnover accelerated by 14 minutes per group."
    ]
    for r in cafe_res:
        p_r = tf17_1.add_paragraph()
        p_r.text = f"• {r}"
        p_r.font.name = "Arial"
        p_r.font.size = Pt(12.5)
        p_r.font.color.rgb = C_TEXT_SUB
        p_r.space_before = Pt(10)

    c17_2 = add_card(s17, Inches(4.8), Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
    tb17_2 = s17.shapes.add_textbox(Inches(5.05), Inches(2.2), Inches(3.2), Inches(4.6))
    tf17_2 = tb17_2.text_frame
    tf17_2.word_wrap = True
    p = tf17_2.paragraphs[0]
    p.text = "Fine Dining & Bistros"
    p.font.name = "Georgia"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_ACCENT
    p_sub2 = tf17_2.add_paragraph()
    p_sub2.text = "Arthur's Theme, Malaka Spice, Terttulia"
    p_sub2.font.name = "Arial"
    p_sub2.font.size = Pt(10.5)
    p_sub2.font.bold = True
    p_sub2.font.color.rgb = C_TEXT_MUTED
    p_sub2.space_before = Pt(2)
    fine_res = [
        "Objection: 'We cannot lose human captain hospitality.'",
        "Solution: Mode B allows captain to review and pace courses.",
        "Outcome: Chef AI wine pairings increase beverage check size by +24%."
    ]
    for r in fine_res:
        p_r = tf17_2.add_paragraph()
        p_r.text = f"• {r}"
        p_r.font.name = "Arial"
        p_r.font.size = Pt(12.5)
        p_r.font.color.rgb = C_TEXT_SUB
        p_r.space_before = Pt(10)

    c17_3 = add_card(s17, Inches(8.8), Inches(2.0), Inches(3.7), Inches(5.0), C_CARD_BG, C_BORDER_SLATE)
    tb17_3 = s17.shapes.add_textbox(Inches(9.05), Inches(2.2), Inches(3.2), Inches(4.6))
    tf17_3 = tb17_3.text_frame
    tf17_3.word_wrap = True
    p = tf17_3.paragraphs[0]
    p.text = "Breweries & Restobars"
    p.font.name = "Georgia"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = C_ROSE_NEON
    p_sub3 = tf17_3.add_paragraph()
    p_sub3.text = "Effingut, FC Road Social, Agent Jack's"
    p_sub3.font.name = "Arial"
    p_sub3.font.size = Pt(10.5)
    p_sub3.font.bold = True
    p_sub3.font.color.rgb = C_TEXT_MUTED
    p_sub3.space_before = Pt(2)
    brew_res = [
        "Objection: 'Large noisy groups cause chaotic ordering.'",
        "Solution: Multiplayer table sync aggregates all orders with guest tags.",
        "Outcome: 9:16 Instagram Story engine drives massive weekend viral reach."
    ]
    for r in brew_res:
        p_r = tf17_3.add_paragraph()
        p_r.text = f"• {r}"
        p_r.font.name = "Arial"
        p_r.font.size = Pt(12.5)
        p_r.font.color.rgb = C_TEXT_SUB
        p_r.space_before = Pt(10)

    # =========================================================================
    # SLIDE 18: SUMMARY, METRICS & LIVE ONBOARDING
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    add_bg(s18)

    tb18 = s18.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.7), Inches(5.8))
    tf18 = tb18.text_frame
    tf18.word_wrap = True

    p = tf18.paragraphs[0]
    p.text = "Transform Your Restaurant with Menuz"
    p.font.name = "Georgia"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_WHITE

    p_sub = tf18.add_paragraph()
    p_sub.text = "The All-in-One Dine-In Operating System & Growth Engine"
    p_sub.font.name = "Georgia"
    p_sub.font.size = Pt(22)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_GOLD_ACCENT
    p_sub.space_before = Pt(8)

    stats = [
        "+22% Average Ticket Value via Smart Pairings & Upsells",
        "+300 Verified 5-Star Reviews or Viral Instagram Stories Monthly",
        "Zero Lost Orders with Multi-Channel KOT Failover (Port 9100 / LAN / POS)",
        "Diner Service Response Times Cut from 10 Mins to Under 60 Seconds",
        "100% Customer Data Ownership with Zero Delivery Commissions"
    ]
    for s in stats:
        p_stat = tf18.add_paragraph()
        p_stat.text = f"✓  {s}"
        p_stat.font.name = "Arial"
        p_stat.font.size = Pt(15)
        p_stat.font.color.rgb = C_TEXT_SUB
        p_stat.space_before = Pt(10)

    p_cta = tf18.add_paragraph()
    p_cta.text = "Live Interactive Platform: stgtrgjrccx.github.io/menuz • Contact: partner@menuz.in"
    p_cta.font.name = "Arial"
    p_cta.font.size = Pt(15)
    p_cta.font.bold = True
    p_cta.font.color.rgb = C_CYAN_ACCENT
    p_cta.space_before = Pt(20)

    # Save
    prs.save(output_pptx_path)
    print(f"Successfully created presentation with new palette: {output_pptx_path}")

if __name__ == "__main__":
    out_dir = os.path.join(os.getcwd(), 'public')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'menuz_executive_pitch_deck.pptx')
    create_deck(out_file)
