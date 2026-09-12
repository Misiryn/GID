import { SecurePassword } from "blitz"
import db from "./index"

const seed = async () => {
  console.log("🌱 Starting Urban Company marketplace seeding on Supabase...")

  // 1. Create Users
  const adminPassword = await SecurePassword.hash("AdminPassword123!")
  const admin = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "ADMIN", name: "Admin" },
    create: {
      email: "admin@example.com",
      name: "Admin",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  })

  const userPassword = await SecurePassword.hash("UserPassword123!")
  const customer = await db.user.upsert({
    where: { email: "rahul@example.com" },
    update: { role: "USER", name: "Rahul Sharma" },
    create: {
      email: "rahul@example.com",
      name: "Rahul Sharma",
      hashedPassword: userPassword,
      role: "USER",
    },
  })
  console.log("✅ Users created (admin@example.com, rahul@example.com)")

  // 2. Categories
  const categoriesData = [
    {
      name: "Cleaning & Pest Control",
      slug: "cleaning",
      icon: "🧹",
      description: "Deep cleaning, bathrooms, kitchens & sofa sanitization",
    },
    {
      name: "AC & Appliance Repair",
      slug: "appliances",
      icon: "❄️",
      description: "Expert servicing & genuine spare parts with 30-day warranty",
    },
    {
      name: "Electrician & Plumber",
      slug: "repairs",
      icon: "⚡",
      description: "Quick doorstep repairs by background-verified technicians",
    },
    {
      name: "Women's Salon & Spa",
      slug: "women-salon",
      icon: "💇‍♀️",
      description: "Salon-at-home services with single-use kits & branded products",
    },
    {
      name: "Men's Grooming",
      slug: "men-grooming",
      icon: "💈",
      description: "Precision haircuts, beard styling & revitalizing massages",
    },
  ]

  const categories: Record<string, any> = {}
  for (const cat of categoriesData) {
    categories[cat.slug] = await db.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log("✅ 5 Categories created")

  // 3. Services
  const servicesData = [
    // Cleaning
    {
      title: "Full Home Deep Cleaning",
      slug: "full-home-deep-cleaning",
      price: 2999,
      offerPrice: 2499,
      duration: "3 - 4 Hours",
      rating: 4.88,
      reviewCount: 3420,
      badge: "Bestseller",
      categorySlug: "cleaning",
      details:
        "Complete deep cleaning of your entire apartment or house. Includes heavy-duty scrubbers, industrial vacuuming, and eco-friendly hospital-grade disinfectants.",
      inclusions:
        "Deep scrubbing of all floors & tiles\nCobweb removal & wall dusting\nComplete bathroom descaling & disinfection\nKitchen oil & grease degreasing\nBalcony & window track cleaning",
      exclusions:
        "Appliance interior cleaning (fridge/oven)\nPaint or wall repair\nTerrace/rooftop cleaning",
      coverImage:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Intense Bathroom Cleaning (Pack of 2)",
      slug: "intense-bathroom-cleaning",
      price: 999,
      offerPrice: 799,
      duration: "90 Mins",
      rating: 4.79,
      reviewCount: 1890,
      badge: "Top Rated",
      categorySlug: "cleaning",
      details:
        "Specialized hard water stain removal, tile descaling, and high-shine ceramic polishing for up to 2 bathrooms.",
      inclusions:
        "Tile & grout descaling with specialized chemicals\nToilet pot & washbasin deep stain removal\nMirror & glass partition streak-free polish\nExhaust fan & tap chrome polishing",
      exclusions: "Ceiling repainting\nPlumbing repairs",
      coverImage:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Kitchen Deep Degreasing & Cleaning",
      slug: "kitchen-deep-cleaning",
      price: 1499,
      offerPrice: 1199,
      duration: "2 Hours",
      rating: 4.84,
      reviewCount: 1210,
      badge: "Popular",
      categorySlug: "cleaning",
      details:
        "Intensive kitchen degreasing covering chimney, gas stove, tiles, sink, and cabinets wiping.",
      inclusions:
        "Chimney exterior & gas stove degreasing\nCabinet exterior wipedown & grease removal\nCountertop, sink & backsplash scrubbing\nFloor mopping with disinfectant",
      exclusions:
        "Chimney filter replacement\nOrganizing internal kitchen drawers",
      coverImage:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Sofa & Cushion Shampooing (3 Seater)",
      slug: "sofa-cleaning",
      price: 899,
      offerPrice: 699,
      duration: "60 Mins",
      rating: 4.72,
      reviewCount: 940,
      badge: "Quick Service",
      categorySlug: "cleaning",
      details:
        "Gentle fabric shampooing and moisture extraction to lift embedded stains, sweat, and allergens.",
      inclusions:
        "Fabric dry vacuuming\nFoam shampoo treatment\nMoisture extraction & deodorization",
      exclusions: "Leather sofa conditioning\nCushion cover stitching",
      coverImage:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    },

    // AC & Appliances
    {
      title: "Split AC Deep Clean & Jet Service",
      slug: "split-ac-jet-service",
      price: 799,
      offerPrice: 599,
      duration: "60 Mins",
      rating: 4.89,
      reviewCount: 5120,
      badge: "Bestseller",
      categorySlug: "appliances",
      details:
        "Advanced jet pump pressure cleaning for indoor cooling coils, blower fan, and outdoor condenser unit.",
      inclusions:
        "Indoor unit high-pressure jet pump wash\nCooling coil & filter deep cleaning\nOutdoor unit airflow clean\nDrain pipe flushing & gas leak check",
      exclusions: "Spare parts & gas refilling\nAC uninstallation or relocation",
      coverImage:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Washing Machine Repair & Checkup",
      slug: "washing-machine-checkup",
      price: 499,
      offerPrice: 349,
      duration: "45 Mins",
      rating: 4.68,
      reviewCount: 820,
      badge: "Verified",
      categorySlug: "appliances",
      details:
        "Complete diagnosis of front load and top load washing machines by certified technicians.",
      inclusions:
        "Full motor, drum & pump diagnosis\nVibration & spin issue troubleshooting\nWater inlet & drainage inspection\nDetailed cost estimate before repairs",
      exclusions: "Cost of replacement spare parts\nPCB circuit board replacement",
      coverImage:
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "RO Water Purifier Servicing",
      slug: "ro-water-purifier-service",
      price: 699,
      offerPrice: 499,
      duration: "60 Mins",
      rating: 4.82,
      reviewCount: 1450,
      badge: "Safe Water",
      categorySlug: "appliances",
      details:
        "Thorough testing and sanitization of domestic RO/UV water filtration units.",
      inclusions:
        "Complete filter & membrane health check\nTDS level testing before & after\nWater tank sanitization\nPump pressure & electrical wiring test",
      exclusions: "Replacement filters/membranes (charged at transparent fixed rates)",
      coverImage:
        "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1000&q=80",
    },

    // Electrician & Plumber
    {
      title: "Switchboard & Electrical Wiring Repair",
      slug: "switchboard-electrical-repair",
      price: 299,
      offerPrice: 199,
      duration: "30 Mins",
      rating: 4.91,
      reviewCount: 2280,
      badge: "Quick Visit",
      categorySlug: "repairs",
      details:
        "Expert electricians for socket replacement, tripping MCBs, and concealed wiring faults.",
      inclusions:
        "Diagnosis of short circuits & tripping\nSwitch/socket replacement & tightening\nMCB & fuse box check\nSafety grounding inspection",
      exclusions: "Cost of new switchboards, wires or MCBs",
      coverImage:
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Tap Leakage & Pipe Repair",
      slug: "tap-leakage-pipe-repair",
      price: 349,
      offerPrice: 249,
      duration: "45 Mins",
      rating: 4.77,
      reviewCount: 1670,
      badge: "Doorstep Pro",
      categorySlug: "repairs",
      details:
        "Fix dripping faucets, leaking angle valves, pipe joints, and minor sink blocks.",
      inclusions:
        "Tap washer replacement & thread sealing\nUnder-sink pipe leakage repair\nWater pressure check across outlets\nDrainage blockage clearance check",
      exclusions: "Concealed wall pipe breaking\nNew sanitary fixture cost",
      coverImage:
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1000&q=80",
    },

    // Women's Salon
    {
      title: "Glow Facial & De-Tan Package",
      slug: "glow-facial-detan",
      price: 1799,
      offerPrice: 1299,
      duration: "90 Mins",
      rating: 4.93,
      reviewCount: 3820,
      badge: "Bestseller",
      categorySlug: "women-salon",
      details:
        "Complete facial rejuvenation with single-use sterile kits, organic extracts, and tan reversal masks.",
      inclusions:
        "Deep skin cleansing & exfoliation\nO3+ Herbal De-Tan mask application\nRelaxing facial acupressure massage\nMoisturizing serum & sunscreen finish\nSingle-use sterile disposables guaranteed",
      exclusions: "Hair styling or makeup",
      coverImage:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Rica Waxing & Threading Combo",
      slug: "rica-waxing-threading",
      price: 1199,
      offerPrice: 899,
      duration: "60 Mins",
      rating: 4.86,
      reviewCount: 2940,
      badge: "Popular",
      categorySlug: "women-salon",
      details:
        "Painless liposoluble Italian Rica wax for smooth, hair-free skin without redness or irritation.",
      inclusions:
        "Full arms & underarms Rica waxing\nHalf legs Rica wax\nEyebrow shaping & upper lip threading\nPost-wax soothing gel application",
      exclusions: "Bikini waxing (available as add-on)",
      coverImage:
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=80",
    },

    // Men's Grooming
    {
      title: "Men's Haircut & Beard Shaping",
      slug: "mens-haircut-beard-styling",
      price: 549,
      offerPrice: 399,
      duration: "45 Mins",
      rating: 4.88,
      reviewCount: 4190,
      badge: "Top Rated",
      categorySlug: "men-grooming",
      details:
        "Master barber doorstep visit with sanitized tools, custom fade cuts, and razor-sharp beard styling.",
      inclusions:
        "Consultation & custom scissor/trimmer cut\nBeard styling & straight-razor edging\nAftershave lotion & beard oil application\nPost-cut neck dusting & hair wash styling",
      exclusions: "Hair coloring or chemical treatments",
      coverImage:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Head Massage & Stress Relief Spa",
      slug: "mens-head-massage-spa",
      price: 449,
      offerPrice: 299,
      duration: "30 Mins",
      rating: 4.95,
      reviewCount: 1530,
      badge: "Relaxing",
      categorySlug: "men-grooming",
      details:
        "Revitalizing warm oil scalp and shoulder massage to melt away workday stress.",
      inclusions:
        "Warm Ayurvedic herbal oil application\nAcupressure head, neck & shoulder massage\nHot towel wrap to stimulate hair follicles",
      exclusions: "Blow dry or hair cut",
      coverImage:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=80",
    },
  ]

  const createdServices: any[] = []
  for (const s of servicesData) {
    const category = categories[s.categorySlug]
    const service = await db.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        price: s.price,
        offerPrice: s.offerPrice,
        duration: s.duration,
        rating: s.rating,
        reviewCount: s.reviewCount,
        badge: s.badge,
        details: s.details,
        inclusions: s.inclusions,
        exclusions: s.exclusions,
        coverImage: s.coverImage,
        categoryId: category?.id,
        userId: admin.id,
      },
      create: {
        title: s.title,
        slug: s.slug,
        price: s.price,
        offerPrice: s.offerPrice,
        duration: s.duration,
        rating: s.rating,
        reviewCount: s.reviewCount,
        badge: s.badge,
        details: s.details,
        inclusions: s.inclusions,
        exclusions: s.exclusions,
        coverImage: s.coverImage,
        categoryId: category?.id,
        userId: admin.id,
      },
    })
    createdServices.push(service)
  }
  console.log(`✅ ${createdServices.length} Services created`)

  // 4. Sample Orders for customer
  const sampleOrders = [
    {
      serviceSlug: "split-ac-jet-service",
      timeSlot: "Tomorrow, 10:00 AM - 12:00 PM",
      status: "CONFIRMED",
      partnerName: "Suresh Patil",
      partnerRating: 4.9,
      paymentMethod: "PAY_AFTER_SERVICE",
      address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
      isCompleted: false,
      is_paid: false,
      total: 599,
      serviceDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      serviceSlug: "full-home-deep-cleaning",
      timeSlot: "15 Sep 2026, 09:00 AM - 01:00 PM",
      status: "IN_PROGRESS",
      partnerName: "Ramesh Sharma",
      partnerRating: 4.8,
      paymentMethod: "ONLINE",
      address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
      isCompleted: false,
      is_paid: true,
      total: 2499,
      serviceDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      serviceSlug: "mens-haircut-beard-styling",
      timeSlot: "02 Sep 2026, 05:00 PM - 06:00 PM",
      status: "COMPLETED",
      partnerName: "Vikram Chauhan",
      partnerRating: 4.9,
      paymentMethod: "ONLINE",
      address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
      isCompleted: true,
      is_paid: true,
      total: 399,
      serviceDateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const o of sampleOrders) {
    const s = createdServices.find((cs) => cs.slug === o.serviceSlug)
    if (s) {
      await db.order.create({
        data: {
          serviceId: s.id,
          userId: customer.id,
          timeSlot: o.timeSlot,
          status: o.status,
          partnerName: o.partnerName,
          partnerRating: o.partnerRating,
          paymentMethod: o.paymentMethod,
          address: o.address,
          isCompleted: o.isCompleted,
          is_paid: o.is_paid,
          total: o.total,
          serviceDateTime: o.serviceDateTime,
        },
      })
    }
  }
  console.log("✅ 3 Sample bookings created for Rahul Sharma")
  console.log("🎉 Seeding complete on Supabase!")
}

export default seed
