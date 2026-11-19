const bcrypt = require('bcryptjs');

const categoriesData = [
  {
    "name": "Kanjivaram Sarees",
    "slug": "kanjivaram-sarees",
    "description": "Heavy 3-ply mulberry pattu silk woven with sacred Korvai borders and pure 24k gold zari.",
    "image": "/sarees/kanjivaram-1.jpg",
    "bannerImage": "/sarees/kanjivaram-2.jpg",
    "itemCount": 5
  },
  {
    "name": "Banarasi Sarees",
    "slug": "banarasi-sarees",
    "description": "Centuries-old weaving heritage from Varanasi adorned with intricate gold and silver brocade.",
    "image": "/sarees/banarasi-1.jpg",
    "bannerImage": "/sarees/banarasi-2.jpg",
    "itemCount": 4
  },
  {
    "name": "Silk Sarees",
    "slug": "silk-sarees",
    "description": "Lustrous pure mulberry, Paithani, Mysore, Baluchari, and Sambalpuri handloom silks.",
    "image": "/sarees/silk-paithani-1.jpg",
    "bannerImage": "/sarees/silk-mysore-1.jpg",
    "itemCount": 10
  },
  {
    "name": "Cotton Sarees",
    "slug": "cotton-sarees",
    "description": "Breathable handloom cottons, Kota Doria, Jamdani, and Tant woven for effortless comfort.",
    "image": "/sarees/cotton-kotadoria-1.jpg",
    "bannerImage": "/sarees/cotton-jamdani-1.jpg",
    "itemCount": 6
  },
  {
    "name": "Wedding Sarees",
    "slug": "wedding-sarees",
    "description": "Heirloom bridal and ceremonial drapes handcrafted to radiate majestic beauty and royal grace.",
    "image": "/sarees/wedding-bridal-1.jpg",
    "bannerImage": "/sarees/kanjivaram-1.jpg",
    "itemCount": 2
  },
  {
    "name": "Party Wear Sarees",
    "slug": "party-wear-sarees",
    "description": "Cocktail shimmer, molten metallic borders, and pre-draped glamour for evening occasions.",
    "image": "/sarees/party-silk-drape.jpg",
    "bannerImage": "/sarees/designer-bandhani-3.jpg",
    "itemCount": 2
  },
  {
    "name": "Designer Sarees",
    "slug": "designer-sarees",
    "description": "Modern silhouettes, authentic Bandhani tie-and-dye, Gharchola, and couture artistry.",
    "image": "/sarees/designer-bandhani-1.jpg",
    "bannerImage": "/sarees/designer-gujrati-1.jpg",
    "itemCount": 3
  },
  {
    "name": "Georgette & Chiffon",
    "slug": "georgette-sarees",
    "description": "Flowy, feather-light drapes with vibrant prints and sheer silhouettes for casual grace.",
    "image": "/sarees/georgette-printed-1.jpg",
    "bannerImage": "/sarees/chiffon-sheer-1.jpg",
    "itemCount": 2
  }
];

const productsData = [
  {
    "name": "Sovereign Crimson Temple Korvai Kanjivaram Silk Saree",
    "slug": "sovereign-crimson-temple-korvai-kanjivaram",
    "description": "Heirloom bridal Kanjivaram hand-interlocked using the sacred Korvai pit-loom technique with traditional temple spires (Thazhampoo rekku) and pure 24K gold zari borders.",
    "category": "Kanjivaram Sarees",
    "price": 28500,
    "discountPrice": 24999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 12,
    "availability": "In Stock",
    "images": [
      "/sarees/kanjivaram-1.jpg",
      "/sarees/kanjivaram-2.jpg"
    ],
    "rating": 4.95,
    "numReviews": 312,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom. Preserve wrapped in unbleached muslin.",
    "ingredients": "100% Pure Mulberry Silk Mark Certified, 24K Gold Dipped Silver Zari."
  },
  {
    "name": "Royal Emerald Green Bridal Muhurtham Kanjivaram Pattu",
    "slug": "royal-emerald-green-bridal-muhurtham-kanjivaram",
    "description": "Auspicious emerald green pure silk adorned with majestic peacock and chakra zari motifs across the expansive 14-inch heavy gold pallu.",
    "category": "Kanjivaram Sarees",
    "price": 32000,
    "discountPrice": 28800,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 8,
    "availability": "In Stock",
    "images": [
      "/sarees/kanjivaram-2.jpg",
      "/sarees/kanjivaram-1.jpg"
    ],
    "rating": 4.9,
    "numReviews": 184,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom. Air in shade every 4 months.",
    "ingredients": "Heavy 3-ply twisted mulberry silk, genuine silver-gilt zari."
  },
  {
    "name": "Celestial Gold & Silver Tissue Brocade Kanjivaram Saree",
    "slug": "celestial-gold-silver-tissue-brocade-kanjivaram",
    "description": "Gilded metallic silk woven with full sona-rupa tissue body, highlighted with delicate meenakari floral motifs for a luminescent bridal presence.",
    "category": "Kanjivaram Sarees",
    "price": 36500,
    "discountPrice": 32900,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 6,
    "availability": "Few Left",
    "images": [
      "/sarees/kanjivaram-3.jpg",
      "/sarees/kanjivaram-1.jpg"
    ],
    "rating": 5.0,
    "numReviews": 96,
    "isFeatured": true,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom. Store on padded roll.",
    "ingredients": "Pure Tissue Silk with continuous metallic brocade warp & weft."
  },
  {
    "name": "Vaira Oosi Fine Diamond Needle-Stripe Kanchipuram Saree",
    "slug": "vaira-oosi-diamond-needle-stripe-kanchipuram",
    "description": "Legendary Vaira Oosi (diamond needle) pattern with parallel micro gold zari lines running through deep vermilion mulberry silk body.",
    "category": "Kanjivaram Sarees",
    "price": 26000,
    "discountPrice": 22500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 10,
    "availability": "In Stock",
    "images": [
      "/sarees/kanjivaram-4.jpg",
      "/sarees/kanjivaram-2.jpg"
    ],
    "rating": 4.88,
    "numReviews": 142,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom. Refold along different creases twice yearly.",
    "ingredients": "Pure South Indian Handloom Pattu Silk, authentic gold zari needlework."
  },
  {
    "name": "Vintage Magenta Shot-Silk Connoisseur Kanjivaram",
    "slug": "vintage-magenta-shot-silk-connoisseur-kanjivaram",
    "description": "Double-shade shot-silk shimmering between violet-magenta and deep crimson, framed with traditional Yazhi and Annapakshi zari motifs.",
    "category": "Kanjivaram Sarees",
    "price": 24000,
    "discountPrice": 19999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 14,
    "availability": "In Stock",
    "images": [
      "/sarees/kanjivaram-5.jpg",
      "/sarees/kanjivaram-3.jpg"
    ],
    "rating": 4.85,
    "numReviews": 89,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "Bespoke dual-tone twisted mulberry silk yarns, pure gold zari."
  },
  {
    "name": "Heritage Banarasi Katan Silk Gold Brocade Saree",
    "slug": "heritage-banarasi-katan-silk-gold-brocade",
    "description": "Imperial Banarasi masterpiece crafted on Varanasi pit-looms with dense floral Kadwa brocade in 24K real gold zari against rich royal ruby katan silk.",
    "category": "Banarasi Sarees",
    "price": 29000,
    "discountPrice": 24500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 9,
    "availability": "In Stock",
    "images": [
      "/sarees/banarasi-1.jpg",
      "/sarees/banarasi-2.jpg"
    ],
    "rating": 4.96,
    "numReviews": 278,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom. Dry clean only.",
    "ingredients": "Pure Katan Silk, Varanasi Kadwa Weave, 24K Gold-wrapped silver zari."
  },
  {
    "name": "Handwoven Kadwa Floral Jaal Banarasi Silk Saree",
    "slug": "handwoven-kadwa-floral-jaal-banarasi-silk",
    "description": "Intricate continuous hunting scene and floral vines (Jangla) hand-engraved into the weft without any loose floats on the reverse.",
    "category": "Banarasi Sarees",
    "price": 34000,
    "discountPrice": 29900,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 7,
    "availability": "In Stock",
    "images": [
      "/sarees/banarasi-2.jpg",
      "/sarees/banarasi-1.jpg"
    ],
    "rating": 4.92,
    "numReviews": 165,
    "isFeatured": true,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom. Wrap in pure muslin.",
    "ingredients": "Pure Katan Mulberry Silk with Ganga-Jamuna dual zari."
  },
  {
    "name": "Antique Gold & Silver Zari Banarasi Shikargah Saree",
    "slug": "antique-gold-silver-zari-banarasi-shikargah",
    "description": "Inspired by royal Mughal archives, depicting imperial hunting pavilions, birds, and forest foliage woven with pure silver and gold wires.",
    "category": "Banarasi Sarees",
    "price": 38000,
    "discountPrice": 34500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 4,
    "availability": "Few Left",
    "images": [
      "/sarees/banarasi-3.jpg",
      "/sarees/banarasi-4.jpg"
    ],
    "rating": 5.0,
    "numReviews": 73,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom.",
    "ingredients": "Pure Silk, Authentic Mughal Shikargah pattern, silver and gold bullion zari."
  },
  {
    "name": "Varanasi Master Handloom Regal Blue Tanchoi Saree",
    "slug": "varanasi-master-handloom-regal-blue-tanchoi",
    "description": "Fine satin-finish Tanchoi weave with featherlight drape and delicate paisley Jamawar embossing that catches the light like liquid sapphire.",
    "category": "Banarasi Sarees",
    "price": 21000,
    "discountPrice": 17800,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 11,
    "availability": "In Stock",
    "images": [
      "/sarees/banarasi-4.jpg",
      "/sarees/banarasi-1.jpg"
    ],
    "rating": 4.87,
    "numReviews": 120,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom.",
    "ingredients": "Pure Tanchoi Mulberry Silk with embossed satin motifs."
  },
  {
    "name": "Yeola Paithani Pure Silk Peacock Asawali Pallu Saree",
    "slug": "yeola-paithani-pure-silk-peacock-asawali",
    "description": "The pride of Maharashtra: handwoven Yeola Paithani with pure gold zari tissue border and vibrant kaleidoscope of dancing peacocks (Mor) on the pallu.",
    "category": "Silk Sarees",
    "price": 27500,
    "discountPrice": 23900,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 8,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-paithani-1.jpg",
      "/sarees/silk-paithani-2.jpg"
    ],
    "rating": 4.97,
    "numReviews": 214,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom.",
    "ingredients": "Pure Yeola Silk, hand-interlocked tapestry weave, 24K gold zari."
  },
  {
    "name": "Historic Gold Brocade Paithani Bridal Saree",
    "slug": "historic-gold-brocade-paithani-bridal",
    "description": "Regal wedding drape in auspicious yellow and crimson with hand-woven Asawali floral vines and intricate muniya border detailing.",
    "category": "Silk Sarees",
    "price": 31000,
    "discountPrice": 26999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 5,
    "availability": "Few Left",
    "images": [
      "/sarees/silk-paithani-2.jpg",
      "/sarees/silk-paithani-1.jpg"
    ],
    "rating": 4.93,
    "numReviews": 158,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom.",
    "ingredients": "100% Pure Silk Mark Certified, Yeola artisan pit-loom weave."
  },
  {
    "name": "Royal Mysore Crepe Silk Pure Gold Zari Saree",
    "slug": "royal-mysore-crepe-silk-pure-gold-zari",
    "description": "Lustrous, feather-soft Mysore silk crepe renowned for its graceful drape, dyed in royal purple and edged with certified pure silver-gilded gold zari lace.",
    "category": "Silk Sarees",
    "price": 18500,
    "discountPrice": 15999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 15,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-mysore-1.jpg",
      "/sarees/mysore-silk-saree.jpg"
    ],
    "rating": 4.94,
    "numReviews": 340,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom. Soft crepe texture.",
    "ingredients": "100% Pure Mulberry Silk Crepe, Mysore GI Tagged Certified."
  },
  {
    "name": "Bishnupur Baluchari Silk Mythological Swarnachari Saree",
    "slug": "bishnupur-baluchari-silk-mythological-swarnachari",
    "description": "Narrative art woven into pure silk: ornate pallu illustrating scenes from the Ramayana and Mahabharata using lustrous gold supplementary weft.",
    "category": "Silk Sarees",
    "price": 22000,
    "discountPrice": 18500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 7,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-baluchari-1.jpg",
      "/sarees/silk-baluchari-2.jpg"
    ],
    "rating": 4.89,
    "numReviews": 112,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational heirloom.",
    "ingredients": "Pure Murshidabad Silk, West Bengal GI Tagged Baluchari weave."
  },
  {
    "name": "Handcrafted Terracotta Baluchari Silk Saree",
    "slug": "handcrafted-terracotta-baluchari-silk",
    "description": "Rich terracotta and crimson silk with delicate miniaturised paisley patterns and ornate ornamental borders woven by master craftsmen.",
    "category": "Silk Sarees",
    "price": 19500,
    "discountPrice": 16900,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 9,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-baluchari-2.jpg",
      "/sarees/silk-baluchari-1.jpg"
    ],
    "rating": 4.86,
    "numReviews": 88,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "Pure Mulberry Silk, untreated natural dyes."
  },
  {
    "name": "Sambalpuri Double Ikat Pure Silk Handloom Saree",
    "slug": "sambalpuri-double-ikat-pure-silk-handloom",
    "description": "Iconic Odisha Baandha handloom: tie-dyed warp and weft creating sharp geometric conch (Sankha) and wheel (Chakra) motifs with contrasting temple border.",
    "category": "Silk Sarees",
    "price": 17800,
    "discountPrice": 14999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 10,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-sambalpuri-1.jpg",
      "/sarees/silk-sambalpuri-2.jpg"
    ],
    "rating": 4.91,
    "numReviews": 198,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "Pure Mulberry Silk, Odisha GI Tagged Double Ikat Baandha."
  },
  {
    "name": "Midnight Blue Sambalpuri Baandha Silk Saree",
    "slug": "midnight-blue-sambalpuri-baandha-silk",
    "description": "Deep celestial blue with intricate fish and floral Baandha motifs handwoven over 45 days on traditional pit-looms in Bargarh.",
    "category": "Silk Sarees",
    "price": 18900,
    "discountPrice": 16200,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 6,
    "availability": "Few Left",
    "images": [
      "/sarees/silk-sambalpuri-2.jpg",
      "/sarees/silk-sambalpuri-3.jpg"
    ],
    "rating": 4.95,
    "numReviews": 167,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "100% Pure Silk, resist-dye tie and dye technique."
  },
  {
    "name": "Auspicious Crimson Sambalpuri Pasapalli Silk Saree",
    "slug": "auspicious-crimson-sambalpuri-pasapalli-silk",
    "description": "Distinctive chessboard (Pasapalli) pattern reminiscent of royal dice games, woven in pure mulberry silk with rich rudraksha borders.",
    "category": "Silk Sarees",
    "price": 16900,
    "discountPrice": 13999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 12,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-sambalpuri-3.jpg",
      "/sarees/silk-sambalpuri-1.jpg"
    ],
    "rating": 4.88,
    "numReviews": 145,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "Pure Handloom Silk, natural dyes, heirloom Pasapalli motif."
  },
  {
    "name": "Phulia Wild Forest Tussar Handloom Silk Saree",
    "slug": "phulia-wild-forest-tussar-handloom-silk",
    "description": "Rich golden textured Tussar (Kosa) silk reeled from wild forest cocoons, celebrated for its natural sheen, breathability, and rustic elegance.",
    "category": "Silk Sarees",
    "price": 14500,
    "discountPrice": 12200,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 14,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-tussar-1.jpg",
      "/sarees/silk-tussar-2.jpg"
    ],
    "rating": 4.87,
    "numReviews": 130,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "Wild Forest Tussar Silk with Ghicha textured weft."
  },
  {
    "name": "Raw Organic Gold Tussar Ghicha Silk Saree",
    "slug": "raw-organic-gold-tussar-ghicha-silk",
    "description": "Earthy, slubbed wild silk drape with temple border prints and hand-spun tassels, providing an effortless statement for formal gatherings.",
    "category": "Silk Sarees",
    "price": 13800,
    "discountPrice": 11500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 8,
    "availability": "In Stock",
    "images": [
      "/sarees/silk-tussar-2.jpg",
      "/sarees/silk-tussar-1.jpg"
    ],
    "rating": 4.84,
    "numReviews": 95,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "100% Wild Tussar & Ghicha Silk."
  },
  {
    "name": "Handcrafted Kota Doria Pure Cotton Zari Border Saree",
    "slug": "handcrafted-kota-doria-pure-cotton-zari-border",
    "description": "Featherlight square check (Khat) weave crafted by artisanal Rajasthan weavers, woven with fine Egyptian cotton and glistening pure gold zari border.",
    "category": "Cotton Sarees",
    "price": 6800,
    "discountPrice": 5499,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 18,
    "availability": "In Stock",
    "images": [
      "/sarees/cotton-kotadoria-1.jpg",
      "/sarees/cotton-kotadoria-2.jpg"
    ],
    "rating": 4.9,
    "numReviews": 210,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Wash gently in cold water.",
    "ingredients": "100% Handloom Cotton with pure zari selvedge, Kota GI certified."
  },
  {
    "name": "Pastel Pink Kota Doria Gota Patti Festive Saree",
    "slug": "pastel-pink-kota-doria-gota-patti-festive",
    "description": "Delicate rose-tinted Kota Doria adorned with exquisite hand-cut Rajasthani Gota Patti marodi needlework for summer festivals and day ceremonies.",
    "category": "Cotton Sarees",
    "price": 8500,
    "discountPrice": 6999,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 11,
    "availability": "In Stock",
    "images": [
      "/sarees/cotton-kotadoria-2.jpg",
      "/sarees/cotton-kotadoria-1.jpg"
    ],
    "rating": 4.88,
    "numReviews": 134,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Dry clean recommended.",
    "ingredients": "Fine Kota Cotton with genuine Gota Patti embellishments."
  },
  {
    "name": "Indigo Blue Handwoven Dhakai Jamdani Muslin Cotton Saree",
    "slug": "indigo-blue-handwoven-dhakai-jamdani-muslin",
    "description": "Legendary floral Jamdani weave created by supplementary weft shuttle on ultra-fine 100-count transparent cotton muslin.",
    "category": "Cotton Sarees",
    "price": 11500,
    "discountPrice": 9500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 7,
    "availability": "In Stock",
    "images": [
      "/sarees/cotton-jamdani-1.jpg",
      "/sarees/cotton-jamdani-2.jpg"
    ],
    "rating": 4.96,
    "numReviews": 178,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Heirloom muslin drape.",
    "ingredients": "100-count Fine Handspun Cotton, discontinuous supplementary weft."
  },
  {
    "name": "Fine Geometric Phool Cotton Jamdani Saree",
    "slug": "fine-geometric-phool-cotton-jamdani",
    "description": "Cream and gold floral jaal hand-embroidered on the loom, providing sheer breathable comfort and ethereal grace.",
    "category": "Cotton Sarees",
    "price": 9800,
    "discountPrice": 8200,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 10,
    "availability": "In Stock",
    "images": [
      "/sarees/cotton-jamdani-2.jpg",
      "/sarees/cotton-jamdani-1.jpg"
    ],
    "rating": 4.85,
    "numReviews": 92,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Delicate muslin handloom.",
    "ingredients": "Pure Cotton Muslin with Jamdani floral medallions."
  },
  {
    "name": "Bengal Tant Handloom Breathable Summer Cotton Saree",
    "slug": "bengal-tant-handloom-breathable-summer-cotton",
    "description": "Traditional Phulia Tant saree with crisp texture, wide borders, and sunburst motifs woven for day-long humid weather comfort.",
    "category": "Cotton Sarees",
    "price": 4200,
    "discountPrice": 3499,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 25,
    "availability": "In Stock",
    "images": [
      "/sarees/cotton-display-1.jpg",
      "/sarees/cotton-display-2.jpg"
    ],
    "rating": 4.81,
    "numReviews": 280,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Gentle hand wash in cold water.",
    "ingredients": "100% Combed Bengal Cotton, natural starched finish."
  },
  {
    "name": "Chettinad Earthy Tone Handspun Temple Border Cotton Saree",
    "slug": "chettinad-earthy-tone-handspun-temple-border-cotton",
    "description": "Heritage Tamil Nadu Chettinad weave with bold earthy mustard and maroon contrast stripes and classic temple spires.",
    "category": "Cotton Sarees",
    "price": 5400,
    "discountPrice": 4500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 16,
    "availability": "In Stock",
    "images": [
      "/sarees/cotton-display-2.jpg",
      "/sarees/cotton-display-1.jpg"
    ],
    "rating": 4.86,
    "numReviews": 160,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Machine wash cold on gentle.",
    "ingredients": "Thick 60s count organic South Indian cotton."
  },
  {
    "name": "Heirloom Crimson Bridal Wedding Saree with 24K Zari",
    "slug": "heirloom-crimson-bridal-wedding-saree-24k-zari",
    "description": "The quintessential royal Indian bridal saree: dense hand-woven Korvai borders, shimmering gold pallu, and sacred auspicious motifs for unforgettable wedding muhurthams.",
    "category": "Wedding Sarees",
    "price": 38000,
    "discountPrice": 32500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 5,
    "availability": "Few Left",
    "images": [
      "/sarees/wedding-bridal-1.jpg",
      "/sarees/kanjivaram-1.jpg"
    ],
    "rating": 5.0,
    "numReviews": 182,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational bridal treasure.",
    "ingredients": "Heavy 3-ply Mulberry Silk, 24K Gold and Pure Silver Zari."
  },
  {
    "name": "Sacred Wedding Muhurtham Koorai Pattu Saree",
    "slug": "sacred-wedding-muhurtham-koorai-pattu",
    "description": "Traditional South Indian wedding Koorai drape in sacred sindoori red with hand-woven rudraksh and gopuram temple borders.",
    "category": "Wedding Sarees",
    "price": 29500,
    "discountPrice": 25800,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 7,
    "availability": "In Stock",
    "images": [
      "/sarees/kanjivaram-4.jpg",
      "/sarees/wedding-bridal-1.jpg"
    ],
    "rating": 4.94,
    "numReviews": 140,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Lifetime heirloom.",
    "ingredients": "Pure handloom Koorai Pattu Silk, authentic gold zari."
  },
  {
    "name": "Glamour Magenta & Royal Purple Metallic Cocktail Saree",
    "slug": "glamour-magenta-royal-purple-metallic-cocktail",
    "description": "Fluid shot-silk that glints under evening lights with molten metallic sheen, pre-pleated drape, and crystal-embellished pallu.",
    "category": "Party Wear Sarees",
    "price": 19500,
    "discountPrice": 16500,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 10,
    "availability": "In Stock",
    "images": [
      "/sarees/party-silk-drape.jpg",
      "/sarees/designer-bandhani-3.jpg"
    ],
    "rating": 4.9,
    "numReviews": 128,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Dry clean only.",
    "ingredients": "Blended metallic silk with fluid lam\u00e9 drape."
  },
  {
    "name": "Radiant Sunset Orange Designer Bandhani Cocktail Saree",
    "slug": "radiant-sunset-orange-designer-bandhani-cocktail",
    "description": "Hand-tied micro Bandhani dots across shimmering georgette-silk with scalloped sequin and zari borders for high-glamour celebrations.",
    "category": "Party Wear Sarees",
    "price": 17500,
    "discountPrice": 14800,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 9,
    "availability": "In Stock",
    "images": [
      "/sarees/designer-bandhani-3.jpg",
      "/sarees/party-silk-drape.jpg"
    ],
    "rating": 4.89,
    "numReviews": 115,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Dry clean only.",
    "ingredients": "Pure Georgette Silk with authentic Kutch tie-and-dye."
  },
  {
    "name": "Heritage Royal Red & Yellow Bandhani Silk Saree",
    "slug": "heritage-royal-red-yellow-bandhani-silk",
    "description": "Couture tie-and-dye masterpiece featuring thousand-dot Ekdali and Shikari motifs with hand-stitched mirror work and gold gota trims.",
    "category": "Designer Sarees",
    "price": 18500,
    "discountPrice": 15400,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 11,
    "availability": "In Stock",
    "images": [
      "/sarees/designer-bandhani-1.jpg",
      "/sarees/designer-bandhani-2.jpg"
    ],
    "rating": 4.92,
    "numReviews": 176,
    "isFeatured": true,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Dry clean only.",
    "ingredients": "Pure Gaji Silk, traditional natural dyes, mirror embellishments."
  },
  {
    "name": "Fine Kutch Hand-Tied Bandhej Georgette Saree",
    "slug": "fine-kutch-hand-tied-bandhej-georgette",
    "description": "Authentic crinkled Bandhej texture on pure flowy georgette, accented with modern pearl and bead tassels on the pallu.",
    "category": "Designer Sarees",
    "price": 15900,
    "discountPrice": 13200,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 12,
    "availability": "In Stock",
    "images": [
      "/sarees/designer-bandhani-2.jpg",
      "/sarees/designer-bandhani-1.jpg"
    ],
    "rating": 4.88,
    "numReviews": 98,
    "isFeatured": false,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Roll-press recommended after dry cleaning.",
    "ingredients": "Pure Viscose Georgette, hand-pinched knot work."
  },
  {
    "name": "Traditional Gujarati Gharchola Mirror Work Saree",
    "slug": "traditional-gujarati-gharchola-mirror-work",
    "description": "Sacred grid-based Gharchola featuring gold zari checks enclosing hand-tied Bandhani and shimmering real abla mirror work.",
    "category": "Designer Sarees",
    "price": 21500,
    "discountPrice": 18200,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 6,
    "availability": "In Stock",
    "images": [
      "/sarees/designer-gujrati-1.jpg",
      "/sarees/designer-bandhani-1.jpg"
    ],
    "rating": 4.95,
    "numReviews": 145,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": true,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Generational treasure.",
    "ingredients": "Pure Silk Cotton Gharchola base with pure zari grid."
  },
  {
    "name": "Artisanal Printed Pure Flowy Georgette Saree",
    "slug": "artisanal-printed-pure-flowy-georgette",
    "description": "Featherweight pure georgette infused with vibrant Indian floral and royal paisley prints, edged with delicate antique zari piping.",
    "category": "Georgette & Chiffon",
    "price": 7900,
    "discountPrice": 6499,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 20,
    "availability": "In Stock",
    "images": [
      "/sarees/georgette-printed-1.jpg",
      "/sarees/chiffon-sheer-1.jpg"
    ],
    "rating": 4.85,
    "numReviews": 180,
    "isFeatured": true,
    "isBestSeller": false,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Gentle hand wash cold.",
    "ingredients": "100% Pure Silk Georgette with digital floral motifs."
  },
  {
    "name": "Featherlight Sheer French Chiffon Saree",
    "slug": "featherlight-sheer-french-chiffon",
    "description": "Ethereal translucent French chiffon with graceful drape, adorned with subtle crystal dustings and delicate silver borders.",
    "category": "Georgette & Chiffon",
    "price": 9200,
    "discountPrice": 7800,
    "weightOptions": [
      "Standard (6.3m with Blouse)",
      "Unstitched Blouse Piece",
      "Custom Stitched Blouse"
    ],
    "stock": 15,
    "availability": "In Stock",
    "images": [
      "/sarees/chiffon-sheer-1.jpg",
      "/sarees/georgette-printed-1.jpg"
    ],
    "rating": 4.89,
    "numReviews": 110,
    "isFeatured": false,
    "isBestSeller": true,
    "isFestivalSpecial": false,
    "isVeg": true,
    "pureGhee": true,
    "shelfLife": "Dry clean only.",
    "ingredients": "Pure Imported Chiffon with fine crystalline borders."
  }
];

const getHashedUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const customerPassword = await bcrypt.hash('customer123', salt);

  return [
    {
      name: 'Sweet Magic Admin',
      email: 'admin@sweetmagic.com',
      password: adminPassword,
      phone: '+91 98765 00001',
      role: 'admin',
      addresses: [
        {
          fullName: 'Sweet Magic Flagship HQ',
          mobile: '9876500001',
          street: 'Plot 42, Road No 10, Banjara Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          isDefault: true
        }
      ]
    },
    {
      name: 'Aarav Sharma',
      email: 'customer@sweetmagic.com',
      password: customerPassword,
      phone: '+91 91234 56789',
      role: 'user',
      addresses: [
        {
          fullName: 'Aarav Sharma',
          mobile: '9123456789',
          street: 'Flat 302, Palm Meadows, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
          isDefault: true
        }
      ]
    }
  ];
};

module.exports = {
  categoriesData,
  productsData,
  getHashedUsers
};

