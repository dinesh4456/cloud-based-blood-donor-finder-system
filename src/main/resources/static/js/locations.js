/**
 * Location Data & Cascading Dropdown Engine
 * Covers All 28 Indian States & 8 Union Territories
 * Structure: Country -> State -> District -> Mandal / Taluk -> Village / Locality
 * Includes intelligent custom entry fallback for any town or village in India.
 */

const LocationData = {
  "India": {
    "Andhra Pradesh": {
      "Anantapur": {
        "Anantapur Urban": ["Anantapur City", "Kakkalapalle", "Papampeta", "Rudraampeta"],
        "Dharmavaram": ["Dharmavaram Town", "Kothapeta", "Mallinaickanapalle"],
        "Kadiri": ["Kadiri Town", "Kalasamudram", "Kummaravandlapalle"],
        "Guntakal": ["Guntakal Town", "Kasapuram", "Nagalapuram"],
        "Tadipatri": ["Tadipatri Town", "Chinnapolamada", "Vanganoor"]
      },
      "Chittoor": {
        "Chittoor": ["Chittoor Town", "Greamspet", "Murakambattu"],
        "Punganur": ["Punganur Town", "Chadalla", "Melumoi"],
        "Nagari": ["Nagari Town", "Ekambarakuppam", "Vadamalapeta"],
        "Palamaner": ["Palamaner Town", "Baireddipalle", "Kurubalakota"]
      },
      "East Godavari": {
        "Rajahmundry Urban": ["Rajahmundry City", "Danavaipeta", "Innespeta", "Aryapuram"],
        "Kakinada Urban": ["Kakinada City", "Sarpavaram", "Suryaraopeta", "Ramanayyapeta"],
        "Amalapuram": ["Amalapuram Town", "Bhatnavilli", "Indupalle"]
      },
      "Guntur": {
        "Guntur Urban": ["Guntur City", "Arundelpet", "Brodipet", "Pattabhipuram"],
        "Tenali": ["Tenali Town", "Nandhivelugu", "Nandivelugu", "Angalakuduru", "Pinapadu", "Chinaravuru", "Burripalem", "Kollipara", "Duggirala"],
        "Mangalagiri": ["Mangalagiri Town", "Nowlur", "Nidamarru", "Kuragallu"],
        "Narasaraopet": ["Narasaraopet Town", "Prakash Nagar", "Lingamguntla"],
        "Bapatla": ["Bapatla Town", "Suryalanka", "Karlapalem"]
      },
      "Krishna": {
        "Vijayawada Urban": ["Vijayawada City", "Benz Circle", "Governorpet", "Patamata", "Gunadala"],
        "Machilipatnam": ["Machilipatnam Town", "Chilakalapudi", "Arisepalli"],
        "Gudivada": ["Gudivada Town", "Valivarthipadu", "Mallayapalem"],
        "Nuzvid": ["Nuzvid Town", "Hanuman Junction", "Borragudem"]
      },
      "Kurnool": {
        "Kurnool Urban": ["Kurnool City", "B Camp", "Joharapuram", "Budhwarpet"],
        "Nandyal": ["Nandyal Town", "Srinivasanagar", "Padmavathi Nagar"],
        "Adoni": ["Adoni Town", "Mandagiri", "Havanur"],
        "Yemmiganur": ["Yemmiganur Town", "Banavasi", "Mugathi"]
      },
      "Nellore": {
        "Nellore Urban": ["Nellore City", "Dargamitta", "Stonehousepet", "Vedayapalem"],
        "Kavali": ["Kavali Town", "Musunur", "Rudrakota"],
        "Gudur": ["Gudur Town", "Chennur", "Chillakur"]
      },
      "Prakasam": {
        "Ongole": ["Ongole Town", "Koppolu", "Pernamitta"],
        "Chirala": ["Chirala Town", "Vetapalem", "Kothapeta"],
        "Markapur": ["Markapur Town", "Tarupupalle", "Rayavaram"]
      },
      "Srikakulam": {
        "Srikakulam": ["Srikakulam City", "Arasavilli", "Gudiveedhi"],
        "Palasa": ["Palasa Town", "Kasibugga", "Brahmanatarla"],
        "Amadalavalasa": ["Amadalavalasa Town", "Thogaram", "Jonnavalasa"]
      },
      "Tirupati": {
        "Tirupati Urban": ["Tirupati City", "Alipiri", "Renigunta", "Chandragiri"],
        "Srikalahasti": ["Srikalahasti Town", "Bahadurpeta", "Subrahmanyapuram"],
        "Puttur": ["Puttur Town", "Vadamalapeta", "Nagari"]
      },
      "Visakhapatnam": {
        "Visakhapatnam Urban": ["Visakhapatnam City", "MVP Colony", "Gajuwaka", "Madhurawada", "Pendurthi"],
        "Anakapalle": ["Anakapalle Town", "Thummapala", "Kasimkota"],
        "Bheemunipatnam": ["Bheemili Town", "Tagarapuvalasa", "Nidigattu"]
      },
      "Vizianagaram": {
        "Vizianagaram": ["Vizianagaram Town", "Cantonment", "Phoolbagh"],
        "Bobbili": ["Bobbili Town", "Gollapalli", "Mettavalasa"]
      },
      "West Godavari": {
        "Bhimavaram": ["Bhimavaram Town", "Gunupudi", "Rayalam"],
        "Eluru": ["Eluru City", "Powerpet", "Sanivarapupeta", "Tangellamudi"],
        "Tanuku": ["Tanuku Town", "Velpur", "Sajjapuram"],
        "Palakollu": ["Palakollu Town", "Lankalakoderu", "Goraganamudi"]
      },
      "YSR Kadapa": {
        "Kadapa Urban": ["Kadapa City", "Nagarajupalle", "Akkayapalle"],
        "Proddatur": ["Proddatur Town", "Bollavaram", "Rameswaram"],
        "Pulivendula": ["Pulivendula Town", "Bakrapuram", "Velpula"]
      }
    },
    "Telangana": {
      "Hyderabad": {
        "Shaikpet": ["Madhapur", "Jubilee Hills", "Banjara Hills", "Film Nagar"],
        "Khairatabad": ["Somajiguda", "Ameerpet", "Punjagutta", "Himayatnagar"],
        "Secunderabad": ["Begumpet", "Paradise", "Marredpally", "Tarnaka"],
        "Charminar": ["Charminar", "Falaknuma", "Chandrayangutta", "Moghalpura"],
        "Asifnagar": ["Mehdipatnam", "Masab Tank", "Tolichowki", "Gudimalkapur"],
        "Musheerabad": ["Musheerabad", "Chikkadpally", "Gandhinagar", "Kavadiguda"]
      },
      "Rangareddy": {
        "Serilingampally": ["Gachibowli", "Kondapur", "Hafeezpet", "Miyapur"],
        "Rajendranagar": ["Attapur", "Budvel", "Bandlaguda Jagir"],
        "Saroornagar": ["Kothapet", "Dilsukhnagar", "Chaitanyapuri"],
        "Hayathnagar": ["Hayathnagar", "Hayathnagar Khalsa", "Pasumamula"],
        "Ibrahimpatnam": ["Ibrahimpatnam", "Khanapur", "Pocharam"]
      },
      "Medchal-Malkajgiri": {
        "Malkajgiri": ["Malkajgiri", "Safilguda", "Neredmet", "Moula Ali"],
        "Kukatpally": ["Kukatpally", "KPHB Colony", "Balanagar", "Moosapet"],
        "Quthbullapur": ["Quthbullapur", "Jeedimetla", "Chintal", "Gajularamaram"],
        "Uppal": ["Uppal", "Habsiguda", "Boduppal", "Peerzadiguda"],
        "Alwal": ["Alwal", "Old Alwal", "Lothkunta", "Machabollaram"]
      },
      "Warangal": {
        "Warangal Urban": ["Warangal City", "Mattu", "Kashibugga", "Deshaipet"],
        "Hanamkonda": ["Hanamkonda", "Subedari", "Kazipet", "Nayeem Nagar"],
        "Narsampet": ["Narsampet Town", "Chennaraopet", "Duggondi"]
      },
      "Karimnagar": {
        "Karimnagar Urban": ["Karimnagar City", "Kothapalli", "Sapthagiri Colony", "Kashmirgadda"],
        "Huzurabad": ["Huzurabad Town", "Jammikunta", "Veenavanka"],
        "Choppadandi": ["Choppadandi", "Gangadhara", "Ramadugu"]
      },
      "Nizamabad": {
        "Nizamabad North": ["Nizamabad City", "Khaleelwadi", "Vinayak Nagar"],
        "Nizamabad South": ["Bodhan", "Armoor", "Bheemgal"],
        "Armoor": ["Armoor Town", "Perkit", "Ankapur"]
      },
      "Khammam": {
        "Khammam Urban": ["Khammam City", "Wyra Road", "Rotary Nagar", "Burhanpuram"],
        "Kothagudem": ["Kothagudem Town", "Palwancha", "Yellandu"],
        "Madhira": ["Madhira Town", "Yerrupalem", "Bonakal"]
      },
      "Nalgonda": {
        "Nalgonda": ["Nalgonda Town", "Clock Tower", "Devarakonda", "Miryalaguda"],
        "Miryalaguda": ["Miryalaguda Town", "Sagar Road", "Alagadapa"],
        "Suryapet": ["Suryapet Town", "Kudakuda", "Balaji Nagar"]
      },
      "Mahabubnagar": {
        "Mahabubnagar Urban": ["Mahabubnagar Town", "Bhoothpur", "Jadcherla"],
        "Jadcherla": ["Jadcherla Town", "Badepally", "Macharam"]
      },
      "Adilabad": {
        "Adilabad Urban": ["Adilabad City", "Dasnapur", "Khamarpally"],
        "Utnoor": ["Utnoor Town", "Narnoor", "Indervelly"]
      }
    },
    "Maharashtra": {
      "Mumbai Suburban": {
        "Andheri": ["Andheri West", "Andheri East", "Lokhandwala", "Versova", "Four Bungalows", "Marol", "Saki Naka"],
        "Bandra": ["Bandra West", "Bandra East", "Khar West", "Santacruz West", "Pali Hill", "Carter Road"],
        "Borivali": ["Borivali West", "Borivali East", "Kandivali West", "Kandivali East", "Malad West", "Malad East"],
        "Kurla": ["Kurla West", "Kurla East", "Ghatkopar West", "Ghatkopar East", "Vidyavihar", "Chembur", "Tilak Nagar"]
      },
      "Mumbai City": {
        "Colaba": ["Colaba", "Cuffe Parade", "Nariman Point", "Fort", "Churchgate", "Marine Lines"],
        "Dadar": ["Dadar West", "Dadar East", "Prabhadevi", "Worli", "Lower Parel", "Mahim"],
        "Byculla": ["Byculla", "Mazgaon", "Parel", "Lalbaug", "Chinchpokli"]
      },
      "Pune": {
        "Haveli": ["Kothrud", "Shivajinagar", "Deccan Gymkhana", "Kalyani Nagar", "Viman Nagar", "Hinjawadi", "Wakad", "Baner", "Aundh"],
        "Pune City": ["Swargate", "Camp", "Sadashiv Peth", "Katraj", "Hadapsar", "Kondhwa"],
        "Pimpri-Chinchwad": ["Pimpri", "Chinchwad", "Nigdi", "Akurdi", "Bhosari", "Sangvi", "Pimple Saudagar"],
        "Baramati": ["Baramati Town", "Malegaon", "Morgaon", "Supa"]
      },
      "Thane": {
        "Thane": ["Thane West", "Thane East", "Naupada", "Ghopbunder Road", "Majiwada", "Vartak Nagar"],
        "Kalyan": ["Kalyan West", "Kalyan East", "Dombivli West", "Dombivli East", "Ulhasnagar"],
        "Navi Mumbai": ["Vashi", "Nerul", "Belapur", "Kharghar", "Airoli", "Ghansoli", "Kopar Khairane"]
      },
      "Nagpur": {
        "Nagpur Urban": ["Dharampeth", "Sitabuldi", "Civil Lines", "Ramdaspeth", "Wardhaman Nagar", "Manish Nagar"],
        "Kamptee": ["Kamptee Town", "Kanhan", "Tekadi"],
        "Hingna": ["Hingna Town", "MIDC Hingna", "Wanadongri"]
      },
      "Nashik": {
        "Nashik": ["Nashik City", "Panchavati", "College Road", "Gangapur Road", "Satpur"],
        "Malegaon": ["Malegaon City", "Camp Malegaon", "Soygaon"],
        "Sinnar": ["Sinnar Town", "Musalgaon", "Pandhurli"]
      },
      "Chhatrapati Sambhajinagar (Aurangabad)": {
        "Aurangabad": ["Aurangabad City", "Cidco", "Waluj", "Kranti Chowk", "Garkheda"],
        "Paithan": ["Paithan Town", "Isarwadi", "Pachod"]
      },
      "Kolhapur": {
        "Karvir": ["Kolhapur City", "Rajarampuri", "Tarabai Park", "Shahupuri"],
        "Shirol": ["Shirol", "Jaysingpur", "Kurundwad"],
        "Hatkanangle": ["Ichalkaranji", "Hatkanangle", "Hupari"]
      },
      "Solapur": {
        "Solapur North": ["Solapur City", "Ashok Chowk", "Jule Solapur"],
        "Pandharpur": ["Pandharpur Town", "Bhalwani", "Korti"]
      },
      "Satara": {
        "Satara": ["Satara City", "Koregaon", "Wai", "Panchgani"],
        "Karad": ["Karad Town", "Ogalewadi", "Malkapur"]
      }
    },
    "Delhi": {
      "Central Delhi": {
        "Connaught Place": ["Connaught Place", "Janpath", "Barakhamba", "Bengali Market"],
        "Karol Bagh": ["Karol Bagh", "Pusa Road", "Rajendra Nagar", "Dev Nagar"],
        "Daryaganj": ["Daryaganj", "Chandni Chowk", "Jama Masjid", "Kashmere Gate"]
      },
      "South Delhi": {
        "Hauz Khas": ["Hauz Khas", "Green Park", "Safdarjung Enclave", "South Extension"],
        "Saket": ["Saket", "Malviya Nagar", "Pushp Vihar", "Sainik Farm"],
        "Mehrauli": ["Mehrauli", "Vasant Kunj", "Qutub Minar Area", "Lado Sarai"],
        "Defence Colony": ["Defence Colony", "Lajpat Nagar", "Greater Kailash 1", "Gulmohar Park"]
      },
      "North Delhi": {
        "Civil Lines": ["Civil Lines", "Kamla Nagar", "Model Town", "Timarpur", "Kalyan Vihar"],
        "Rohini": ["Rohini Sector 1-10", "Rohini Sector 11-25", "Prashant Vihar", "Pitampura"],
        "Alipur": ["Alipur Village", "Narela", "Bakhtawarpur"]
      },
      "East Delhi": {
        "Preet Vihar": ["Preet Vihar", "Laxmi Nagar", "Nirman Vihar", "Shakarpur"],
        "Mayur Vihar": ["Mayur Vihar Phase 1", "Mayur Vihar Phase 2", "Mayur Vihar Phase 3", "Patparganj"],
        "Gandhi Nagar": ["Gandhi Nagar", "Krishna Nagar", "Geeta Colony"]
      },
      "West Delhi": {
        "Rajouri Garden": ["Rajouri Garden", "Tagore Garden", "Subhash Nagar", "Kirti Nagar"],
        "Janakpuri": ["Janakpuri Block A-D", "Uttam Nagar", "Tilak Nagar", "Vikas Puri"],
        "Punjabi Bagh": ["Punjabi Bagh West", "Punjabi Bagh East", "Paschim Vihar", "Madipur"]
      },
      "South West Delhi": {
        "Dwarka": ["Dwarka Sector 1-10", "Dwarka Sector 11-23", "Palam", "Mahavir Enclave"],
        "Najafgarh": ["Najafgarh Town", "Dichaon Kalan", "Roshanpura"],
        "Delhi Cantt": ["Delhi Cantt", "Dhaula Kuan", "Subroto Park"]
      },
      "North West Delhi": {
        "Saraswati Vihar": ["Saraswati Vihar", "Rani Bagh", "Shalimar Bagh", "Ashok Vihar"],
        "Kanjhawala": ["Kanjhawala Village", "Bawana", "Pooth Kalan"]
      },
      "New Delhi": {
        "Chanakyapuri": ["Chanakyapuri", "Shanti Path", "Moti Bagh"],
        "Parliament Street": ["Parliament Street", "Khan Market", "Lodhi Colony"]
      }
    },
    "Karnataka": {
      "Bangalore Urban": {
        "Bangalore South": ["Koramangala", "Jayanagar", "JP Nagar", "BTM Layout", "Bannerghatta Road", "Electronic City", "HSR Layout"],
        "Bangalore East": ["Indiranagar", "Whitefield", "Marathahalli", "CV Raman Nagar", "KR Puram", "Bellandur"],
        "Bangalore North": ["Hebbal", "Yelahanka", "RT Nagar", "Malleshwaram", "Yeshwanthpur", "Sadashivanagar"],
        "Bangalore West": ["Rajajinagar", "Vijayanagar", "Basaveshwaranagar", "Basavanagudi"],
        "Anekal": ["Anekal Town", "Attibele", "Chandapura", "Jigani"]
      },
      "Bangalore Rural": {
        "Devanahalli": ["Devanahalli Town", "Airport City", "Vijayapura"],
        "Nelamangala": ["Nelamangala Town", "Doddabele", "Thyamagondlu"],
        "Hosakote": ["Hosakote Town", "Anugondanahalli", "Jadigenahalli"]
      },
      "Mysore": {
        "Mysore Urban": ["Mysore City", "Gokulam", "Jayalakshmipuram", "Kuvempunagar", "Saraswathipuram"],
        "Hunsur": ["Hunsur Town", "Bilikere", "Hanagod"],
        "Nanjangud": ["Nanjangud Town", "Kowlande", "Tagadur"]
      },
      "Dakshina Kannada": {
        "Mangalore": ["Mangalore City", "Hampankatta", "Kadri", "Kankanady", "Surathkal", "Panambur"],
        "Bantwal": ["Bantwal Town", "Panemangalore", "Mani"],
        "Puttur": ["Puttur Town", "Uppinangady", "Kabaka"]
      },
      "Belagavi": {
        "Belagavi Urban": ["Belagavi City", "Tilakwadi", "Camp Belagavi", "Shahapur"],
        "Chikodi": ["Chikodi Town", "Nipani", "Sadalga"],
        "Gokak": ["Gokak Town", "Gokak Falls", "Koujalgi"]
      },
      "Dharwad": {
        "Hubli Urban": ["Hubli City", "Vidyanagar", "Keshwapur", "Gokul Road"],
        "Dharwad Urban": ["Dharwad City", "Saptapur", "Sadhankeri", "Navanagar"]
      },
      "Udupi": {
        "Udupi": ["Udupi Town", "Manipal", "Malpe", "Brahmavar"],
        "Kundapura": ["Kundapura Town", "Koteshwara", "Byndoor"]
      }
    },
    "Tamil Nadu": {
      "Chennai": {
        "Mylapore": ["Mylapore", "Mandaveli", "Alwarpet", "RA Puram", "Gopalapuram"],
        "Guindy": ["Adyar", "Besant Nagar", "Guindy", "Velachery", "Thiruvanmiyur", "Saidapet"],
        "Egmore": ["Egmore", "Nungambakkam", "Chetpet", "Kilpauk", "Choolaimedu"],
        "T Nagar": ["T Nagar", "Teynampet", "West Mambalam", "Kodambakkam", "Vadapalani"],
        "Anna Nagar": ["Anna Nagar East", "Anna Nagar West", "Shenoy Nagar", "Koyambedu", "Mogappair"],
        "Perambur": ["Perambur", "Vyasarpadi", "Sembium", "Kolathur"]
      },
      "Coimbatore": {
        "Coimbatore North": ["RS Puram", "Saibaba Colony", "Gandhipuram", "Peelamedu", "Saravanampatti"],
        "Coimbatore South": ["Ukkadam", "Ramanathapuram", "Singanallur", "Sundarapuram"],
        "Pollachi": ["Pollachi Town", "Kinathukadavu", "Anaimalai"]
      },
      "Madurai": {
        "Madurai North": ["Tallakulam", "KK Nagar", "Goripalayam", "Sellur"],
        "Madurai South": ["Meenakshi Temple Area", "Simmakkal", "Periyar Bus Stand", "Villapuram"]
      },
      "Tiruchirappalli": {
        "Trichy Urban": ["Trichy City", "Thillai Nagar", "Cantonment", "Srirangam", "KMC Colony"]
      },
      "Salem": {
        "Salem Urban": ["Salem City", "Fairlands", "Hasthampatti", "Suramangalam", "Shevapet"]
      },
      "Kanchipuram": {
        "Kanchipuram": ["Kanchipuram Town", "Orikkai", "Sevilimedu"],
        "Sriperumbudur": ["Sriperumbudur Town", "Irungattukottai", "Oragadam"]
      }
    },
    "Uttar Pradesh": {
      "Lucknow": {
        "Lucknow Urban": ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Mahanagar", "Charbagh"],
        "Mohanlalganj": ["Mohanlalganj Town", "Goshainganj", "Nagram"]
      },
      "Kanpur Nagar": {
        "Kanpur Urban": ["Civil Lines", "Swaroop Nagar", "Kalyanpur", "Govind Nagar", "Kakadeo"],
        "Ghatampur": ["Ghatampur Town", "Patara", "Bhitargaon"]
      },
      "Gautam Buddha Nagar": {
        "Noida": ["Sector 18", "Sector 62", "Sector 50", "Sector 137", "Sector 150"],
        "Greater Noida": ["Pari Chowk", "Alpha 1", "Beta 2", "Omega", "Knowledge Park"],
        "Dadri": ["Dadri Town", "Surajpur", "Jarcha"]
      },
      "Ghaziabad": {
        "Ghaziabad Urban": ["Raj Nagar", "Kavi Nagar", "Vasundhara", "Vaishali", "Indirapuram", "Crossings Republik"],
        "Modinagar": ["Modinagar Town", "Bhojpur", "Niwar"]
      },
      "Varanasi": {
        "Varanasi Urban": ["Assi Ghat", "Godowlia", "Cantonment", "Sigra", "Lanka", "Bhelupur"],
        "Pindra": ["Pindra Town", "Phulpur", "Baragaon"]
      },
      "Prayagraj": {
        "Prayagraj Urban": ["Civil Lines", "Georgetown", "Allahpur", "Katra", "Naini"],
        "Phulpur": ["Phulpur Town", "Jhusi", "Sahson"]
      },
      "Agra": {
        "Agra Urban": ["Tajganj", "Sanjay Place", "Kamla Nagar", "Dayalbagh", "Shahganj"],
        "Fatehpur Sikri": ["Fatehpur Sikri Town", "Kiraoli", "Achhnera"]
      },
      "Meerut": {
        "Meerut Urban": ["Shastri Nagar", "Civil Lines", "Begum Bridge", "Pallavpuram"],
        "Mawana": ["Mawana Town", "Hastinapur", "Parikshitgarh"]
      }
    },
    "Gujarat": {
      "Ahmedabad": {
        "Ahmedabad City": ["Navrangpura", "Vastrapur", "Bodakdev", "Maninagar", "Satellite", "Paldi"],
        "Daskroi": ["Bopal", "Ghuma", "Kathwada", "Aslali"],
        "Sanand": ["Sanand Town", "Shela", "Changodar"]
      },
      "Surat": {
        "Surat City": ["Adajan", "Athwa", "Vesu", "Varachha", "Piplod", "Katargam"],
        "Choryasi": ["Sachin", "Dumas", "Bhimrad"]
      },
      "Vadodara": {
        "Vadodara City": ["Alkapuri", "Sayajigunj", "Akota", "Fatehgunj", "Manjalpur", "Gorwa"],
        "Padra": ["Padra Town", "Loj", "Mobha"]
      },
      "Rajkot": {
        "Rajkot City": ["Kalawad Road", "University Road", "Yagnik Road", "Pedak Road"],
        "Gondal": ["Gondal Town", "Gomta", "Derdi"]
      }
    },
    "West Bengal": {
      "Kolkata": {
        "Central Kolkata": ["Park Street", "BBD Bagh", "Esplanade", "Burrabazar", "Sealdah"],
        "South Kolkata": ["Ballygunge", "Alipore", "Tollygunge", "Jadavpur", "Garia", "Behala"],
        "North Kolkata": ["Shyambazar", "Hatibagan", "Dum Dum", "Bagbazar", "Maniktala"],
        "East Kolkata": ["Salt Lake Sector 1-5", "New Town Action Area 1-3", "Rajarhat", "Ruby More"]
      },
      "Howrah": {
        "Howrah City": ["Howrah Station Area", "Shibpur", "Mandirtala", "Liluah", "Salkia"],
        "Bally": ["Bally Town", "Belur", "Uttarpara"]
      },
      "North 24 Parganas": {
        "Barasat": ["Barasat Town", "Madhyamgram", "Hridaypur"],
        "Barrackpore": ["Barrackpore Cantt", "Titagarh", "Khardah"]
      },
      "Darjeeling": {
        "Darjeeling Sadar": ["The Mall", "Chowrasta", "Ghum", "Lebong"],
        "Siliguri": ["Siliguri Town", "Sevoke Road", "Pradhan Nagar", "Matigara"]
      }
    },
    "Rajasthan": {
      "Jaipur": {
        "Jaipur Urban": ["Malviya Nagar", "Vaishali Nagar", "C-Scheme", "Mansarovar", "Raja Park", "Jagatpura"],
        "Sanganer": ["Sanganer Town", "Sitapura", "Pratap Nagar"],
        "Amer": ["Amer Town", "Kukas", "Chandwaji"]
      },
      "Jodhpur": {
        "Jodhpur Urban": ["Sardarpura", "Shastri Nagar", "Ratanada", "Pal Road", "Paota"],
        "Luni": ["Luni Town", "Salawas", "Dhandhaniya"]
      },
      "Udaipur": {
        "Udaipur Urban": ["Fateh Sagar Area", "Hiran Magri", "Panchwati", "Sukher"],
        "Girwa": ["Girwa Town", "Bhuwana", "Badi"]
      },
      "Kota": {
        "Kota Urban": ["Vigyan Nagar", "Talwandi", "Dadabari", "Kunhari", "Gumanpura"]
      }
    },
    "Kerala": {
      "Ernakulam": {
        "Kochi": ["Marine Drive", "MG Road", "Fort Kochi", "Mattancherry", "Kadavanthra", "Panampilly Nagar"],
        "Kanayannur": ["Edappally", "Kakkanad (Infopark)", "Kaloor", "Palarivattom", "Vyttila"],
        "Aluva": ["Aluva Town", "Angamaly", "Nedumbassery", "Companypady"]
      },
      "Thiruvananthapuram": {
        "Thiruvananthapuram Urban": ["Palayam", "Vellayambalam", "Kowdiar", "Pattom", "Kazhakkoottam (Technopark)", "Thampanoor"],
        "Neyyattinkara": ["Neyyattinkara Town", "Balaramapuram", "Amaravila"]
      },
      "Kozhikode": {
        "Kozhikode Urban": ["Mananchira", "Mavoor Road", "Beach Road", "Nadakkavu", "West Hill"],
        "Vadakara": ["Vadakara Town", "Chombala", "Nut Street"]
      }
    },
    "Punjab": {
      "Ludhiana": {
        "Ludhiana East": ["Model Town", "Civil Lines", "Sarabha Nagar", "Ferozepur Road"],
        "Ludhiana West": ["BRS Nagar", "Aggar Nagar", "Dugri", "Gill Road"]
      },
      "Amritsar": {
        "Amritsar I": ["Golden Temple Area", "Ranjit Avenue", "Mall Road", "Lawrence Road"],
        "Amritsar II": ["Chheharta", "Putligarh", "Majitha Road"]
      },
      "SAS Nagar (Mohali)": {
        "Mohali Urban": ["Phase 1-11", "Sector 67-82", "Aerocity", "Kharar Town"]
      },
      "Jalandhar": {
        "Jalandhar Urban": ["Model Town", "Civil Lines", "Cantt Road", "Rama Mandi", "BMC Chowk"]
      }
    },
    "Bihar": {
      "Patna": {
        "Patna Sadar": ["Kankarbagh", "Boring Road", "Bailey Road", "Fraser Road", "Rajendra Nagar", "Patliputra"],
        "Danapur": ["Danapur Cantt", "Khagaul", "Saguna More"]
      },
      "Gaya": {
        "Gaya Sadar": ["Civil Lines", "Rampur", "AP Colony", "Bodh Gaya Town"]
      },
      "Muzaffarpur": {
        "Muzaffarpur Urban": ["Mithanpura", "Brahmpura", "Kalambagh Road", "Juran Chapra"]
      }
    },
    "Madhya Pradesh": {
      "Bhopal": {
        "Bhopal Urban": ["MP Nagar", "Arera Colony", "Shahpura", "TT Nagar", "Hoshangabad Road", "Kolar Road"]
      },
      "Indore": {
        "Indore Urban": ["Vijay Nagar", "Palasia", "MG Road", "Sapna Sangeeta", "Bhawarkua", "Super Corridor"]
      },
      "Gwalior": {
        "Gwalior Urban": ["City Centre", "Lashkar", "Morar", "Thatipur", "Phoolbagh"]
      },
      "Jabalpur": {
        "Jabalpur Urban": ["Civil Lines", "Wright Town", "Napier Town", "Vijay Nagar", "Gorakhpur"]
      }
    },
    "Haryana": {
      "Gurugram": {
        "Gurugram Urban": ["DLF Phase 1-5", "Cyber City", "Golf Course Road", "Sohna Road", "Sector 14-57", "MG Road"],
        "Manesar": ["IMT Manesar", "Pataudi", "Farrukhnagar"]
      },
      "Faridabad": {
        "Faridabad Urban": ["Sector 15-16", "NIT 1-5", "Greenfield", "Neharpar / Greater Faridabad"]
      },
      "Panchkula": {
        "Panchkula Urban": ["Sector 1-21", "MDC Sector 4-6", "Pinjore", "Kalka"]
      },
      "Ambala": {
        "Ambala Urban": ["Ambala Cantt", "Ambala City", "Model Town", "Barara"]
      }
    },
    "Odisha": {
      "Khordha": {
        "Bhubaneswar Urban": ["Nayapalli", "Saheed Nagar", "Khandagiri", "Chandrasekharpur", "Patia", "Jaydev Vihar"],
        "Khordha Town": ["Khordha Sadar", "Jatni", "Begunia"]
      },
      "Cuttack": {
        "Cuttack Urban": ["Badambadi", "CDA Sector 1-11", "Madhupatna", "Choudwar", "Bidanasi"]
      },
      "Puri": {
        "Puri Sadar": ["Grand Road", "VIP Road", "Sea Beach", "Chakratirtha Road"]
      }
    },
    "Assam": {
      "Kamrup Metropolitan": {
        "Guwahati Urban": ["Dispur", "Paltan Bazaar", "GS Road", "Ulubari", "Ganeshguri", "Pan Bazaar", "Six Mile"]
      },
      "Dibrugarh": {
        "Dibrugarh Urban": ["Dibrugarh Town", "Chowkidinghee", "Jalan Nagar", "Thana Chariali"]
      },
      "Cachar": {
        "Silchar Urban": ["Silchar Town", "Tarapur", "Rangirkhari", "Ambikapatty"]
      }
    },
    "Jharkhand": {
      "Ranchi": {
        "Ranchi Urban": ["Main Road", "Lalpur", "Doranda", "Harmu", "Kanke Road", "Bariatu", "Morabadi"]
      },
      "East Singhbhum": {
        "Jamshedpur Urban": ["Bistupur", "Sakchi", "Kadma", "Sonari", "Telco", "Golmuri"]
      },
      "Dhanbad": {
        "Dhanbad Urban": ["Bank More", "Saraidhela", "Hirapur", "Jharia", "Katras"]
      }
    },
    "Chhattisgarh": {
      "Raipur": {
        "Raipur Urban": ["Pandri", "Telibandha", "Shankar Nagar", "Devendra Nagar", "Tatibandh", "Nava Raipur"]
      },
      "Durg": {
        "Bhilai Urban": ["Sector 1-10", "Nehru Nagar", "Supela", "Civic Centre", "Durg City"]
      },
      "Bilaspur": {
        "Bilaspur Urban": ["Vyapar Vihar", "Rajkishore Nagar", "Torwa", "Sarkanda"]
      }
    },
    "Goa": {
      "North Goa": {
        "Tiswadi (Panaji)": ["Panaji City", "Miramar", "Dona Paula", "Caranzalem", "Ribandar"],
        "Bardez (Mapusa)": ["Mapusa Town", "Calangute", "Candolim", "Porvorim", "Anjuna"]
      },
      "South Goa": {
        "Salcete (Margao)": ["Margao City", "Fatorda", "Benaulim", "Colva", "Navelim"],
        "Mormugao (Vasco)": ["Vasco da Gama", "Chicalim", "Dabolim", "Bogmalo"]
      }
    },
    "Uttarakhand": {
      "Dehradun": {
        "Dehradun Urban": ["Rajpur Road", "Paltan Bazaar", "Ballupur", "Vasant Vihar", "Clement Town", "Rishikesh Town"],
        "Mussoorie": ["Mussoorie Town", "Library Chowk", "Landour"]
      },
      "Haridwar": {
        "Haridwar Urban": ["Har Ki Pauri", "Ranipur More", "BHEL Township", "Jwalapur", "Kankhal"]
      },
      "Nainital": {
        "Nainital Urban": ["Mall Road", "Tallital", "Mallital", "Haldwani Town", "Kathgodam"]
      }
    },
    "Himachal Pradesh": {
      "Shimla": {
        "Shimla Urban": ["The Mall", "Sanjauli", "Chotta Shimla", "Kasumpti", "New Shimla", "Lakkar Bazaar"]
      },
      "Kangra": {
        "Dharamshala": ["Kotwali Bazaar", "McLeodganj", "Dari", "Palampur Town"]
      },
      "Kullu": {
        "Kullu Sadar": ["Kullu Town", "Manali Town", "Bhuntar", "Naggar"]
      }
    },
    "Jammu and Kashmir": {
      "Srinagar": {
        "Srinagar Urban": ["Lal Chowk", "Rajbagh", "Karan Nagar", "Dalgate", "Hazratbal", "Hyderpora"]
      },
      "Jammu": {
        "Jammu Urban": ["Gandhi Nagar", "Trikuta Nagar", "Janipur", "Channi Himmat", "Bahu Fort"]
      }
    },
    "Chandigarh": {
      "Chandigarh": {
        "Chandigarh City": ["Sector 1-17", "Sector 18-35", "Sector 36-47", "Manimajra", "IT Park"]
      }
    },
    "Puducherry": {
      "Pondicherry": {
        "Pondicherry Town": ["White Town", "Heritage Town", "Lawspet", "Reddiarpalayam", "Muthialpet"]
      }
    },
    "Ladakh": {
      "Leh": {
        "Leh Sadar": ["Main Bazaar", "Changspa", "Choglamsar", "Shey"]
      },
      "Kargil": {
        "Kargil Sadar": ["Kargil Town", "Drass", "Baroo"]
      }
    },
    "Andaman and Nicobar Islands": {
      "South Andaman": {
        "Port Blair": ["Aberdeen Bazaar", "Junglighat", "Haddo", "Garacharma"]
      }
    },
    "Dadra and Nagar Haveli and Daman and Diu": {
      "Daman": {
        "Daman Town": ["Nani Daman", "Moti Daman", "Devka Beach"]
      },
      "Silvassa": {
        "Silvassa Town": ["Silvassa", "Amli", "Naroli"]
      }
    },
    "Lakshadweep": {
      "Lakshadweep": {
        "Kavaratti": ["Kavaratti Island", "Agatti Island", "Minicoy"]
      }
    },
    "Manipur": {
      "Imphal West": {
        "Imphal Urban": ["Thangal Bazar", "Paona Bazar", "Lamphelpat", "Uripok"]
      },
      "Imphal East": {
        "Porompat": ["Porompat", "Khurai", "Palace Compound"]
      }
    },
    "Meghalaya": {
      "East Khasi Hills": {
        "Shillong Urban": ["Police Bazar", "Laban", "Laitumkhrah", "Mawkhar", "Risa Colony"]
      }
    },
    "Mizoram": {
      "Aizawl": {
        "Aizawl Urban": ["Zarkawt", "Khatla", "Bawngkawn", "Dawrpui", "Chanmari"]
      }
    },
    "Nagaland": {
      "Kohima": {
        "Kohima Urban": ["High School Junction", "Midlane", "Razhu Point", "PR Hill"]
      },
      "Dimapur": {
        "Dimapur Urban": ["City Tower", "Duncan Bosti", "Purana Bazar", "Walford"]
      }
    },
    "Tripura": {
      "West Tripura": {
        "Agartala Urban": ["Banamalipur", "Radhanagar", "Battala", "Kunjaban", "Indranagar"]
      }
    },
    "Sikkim": {
      "East Sikkim": {
        "Gangtok Urban": ["MG Marg", "Deorali", "Tadong", "Development Area", "Burtuk"]
      }
    },
    "Arunachal Pradesh": {
      "Papum Pare": {
        "Itanagar Urban": ["Bank Tinali", "Ganga Market", "Naharlagun", "Nirjuli"]
      }
    }
  },
  "United States": {
    "California": {
      "Los Angeles County": {
        "Los Angeles": ["Downtown LA", "Hollywood", "Westwood", "Venice"],
        "Long Beach": ["Downtown Long Beach", "Belmont Shore"]
      },
      "San Francisco County": {
        "San Francisco": ["SoMa", "Mission District", "Financial District", "Marina"]
      }
    },
    "New York": {
      "New York County": {
        "Manhattan": ["Midtown", "Upper East Side", "Upper West Side", "Lower Manhattan"],
        "Brooklyn": ["Williamsburg", "DUMBO", "Park Slope", "Brooklyn Heights"]
      }
    }
  },
  "United Kingdom": {
    "England": {
      "Greater London": {
        "City of London": ["Westminster", "Camden", "Canary Wharf", "Greenwich"]
      }
    }
  }
};

const Locations = {
  defaultSelectText: "-- Select --",
  customOptionValue: "__CUSTOM__",

  populateTarget(targetEl, items, selectedVal = "", defaultLabel = null) {
    if (!targetEl) return;

    const listId = targetEl.getAttribute ? targetEl.getAttribute("list") : null;
    let datalistEl = targetEl.list || (listId ? document.getElementById(listId) : null);

    const isSelect = targetEl.tagName && targetEl.tagName.toLowerCase() === "select";
    const sorted = [...(items || [])].sort((a, b) => a.localeCompare(b));

    if (datalistEl) {
      datalistEl.innerHTML = "";
      sorted.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        datalistEl.appendChild(opt);
      });
      if (selectedVal) {
        targetEl.value = selectedVal;
      }
    } else if (isSelect) {
      const placeholder = defaultLabel !== null ? defaultLabel : this.defaultSelectText;
      targetEl.innerHTML = `<option value="">${placeholder}</option>`;
      let hasMatch = false;

      sorted.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        if (selectedVal && selectedVal.trim().toLowerCase() === item.trim().toLowerCase()) {
          opt.selected = true;
          hasMatch = true;
        }
        targetEl.appendChild(opt);
      });

      if (selectedVal && !hasMatch && selectedVal !== this.customOptionValue) {
        const customOpt = document.createElement("option");
        customOpt.value = selectedVal;
        customOpt.textContent = selectedVal;
        customOpt.selected = true;
        targetEl.appendChild(customOpt);
      }
    } else {
      if (selectedVal) {
        targetEl.value = selectedVal;
      }
    }
  },

  populateSelect(selectEl, items, selectedVal = "", defaultLabel = null) {
    this.populateTarget(selectEl, items, selectedVal, defaultLabel);
  },

  getCountries() {
    return Object.keys(LocationData);
  },

  getStates(country = "India") {
    if (!country || !LocationData[country]) return [];
    return Object.keys(LocationData[country]);
  },

  getDistricts(country = "India", state = "") {
    if (!country || !state || !LocationData[country] || !LocationData[country][state]) return [];
    return Object.keys(LocationData[country][state]);
  },

  getMandals(country = "India", state = "", district = "") {
    if (!country || !state || !district || !LocationData[country] || !LocationData[country][state] || !LocationData[country][state][district]) {
      return [];
    }
    const districtObj = LocationData[country][state][district];
    if (Array.isArray(districtObj)) return districtObj;
    return Object.keys(districtObj);
  },

  getVillages(country = "India", state = "", district = "", mandal = "") {
    if (!country || !state || !district || !LocationData[country] || !LocationData[country][state] || !LocationData[country][state][district]) {
      return [];
    }
    const districtObj = LocationData[country][state][district];
    if (Array.isArray(districtObj)) return districtObj;
    if (!mandal || !districtObj[mandal]) {
      const allVillages = [];
      Object.values(districtObj).forEach(arr => {
        if (Array.isArray(arr)) allVillages.push(...arr);
      });
      return Array.from(new Set(allVillages));
    }
    return districtObj[mandal] || [];
  },

  setupFullCascading({
    country = "India",
    stateEl,
    districtEl,
    mandalEl,
    villageEl,
    initialValues = {},
    placeholders = {
      state: "-- Select State --",
      district: "-- Select District --",
      mandal: "-- Select Mandal / Taluk --",
      village: "-- Select Village / Locality --"
    }
  }) {
    if (!stateEl) return;

    const statePh = placeholders?.state || "-- Select State --";
    const districtPh = placeholders?.district || "-- Select District --";
    const mandalPh = placeholders?.mandal || "-- Select Mandal / Taluk --";
    const villagePh = placeholders?.village || "-- Select Village / Locality --";

    const updateVillages = (stateVal, districtVal, mandalVal, selectedVillage = "") => {
      if (!villageEl) return;
      const villages = this.getVillages(country, stateVal, districtVal, mandalVal);
      this.populateTarget(villageEl, villages, selectedVillage, villagePh);
    };

    const updateMandals = (stateVal, districtVal, selectedMandal = "", selectedVillage = "") => {
      if (!mandalEl) return;
      const mandals = this.getMandals(country, stateVal, districtVal);
      this.populateTarget(mandalEl, mandals, selectedMandal, mandalPh);
      updateVillages(stateVal, districtVal, mandalEl.value || selectedMandal, selectedVillage);
    };

    const updateDistricts = (stateVal, selectedDistrict = "", selectedMandal = "", selectedVillage = "") => {
      if (!districtEl) return;
      const districts = this.getDistricts(country, stateVal);
      this.populateTarget(districtEl, districts, selectedDistrict, districtPh);
      updateMandals(stateVal, districtEl.value || selectedDistrict, selectedMandal, selectedVillage);
    };

    // 1. Populate initial States
    const states = this.getStates(country);
    this.populateTarget(stateEl, states, initialValues.state || "", statePh);

    // 2. Event Handlers for both typing and selecting
    const handleStateChange = () => {
      const sVal = stateEl.value?.trim() || "";
      updateDistricts(sVal, "", "", "");
    };

    const handleDistrictChange = () => {
      const sVal = stateEl?.value?.trim() || "";
      const dVal = districtEl?.value?.trim() || "";
      updateMandals(sVal, dVal, "", "");
    };

    const handleMandalChange = () => {
      const sVal = stateEl?.value?.trim() || "";
      const dVal = districtEl?.value?.trim() || "";
      const mVal = mandalEl?.value?.trim() || "";
      updateVillages(sVal, dVal, mVal, "");
    };

    stateEl.oninput = handleStateChange;
    stateEl.onchange = handleStateChange;

    if (districtEl) {
      districtEl.oninput = handleDistrictChange;
      districtEl.onchange = handleDistrictChange;
    }

    if (mandalEl) {
      mandalEl.oninput = handleMandalChange;
      mandalEl.onchange = handleMandalChange;
    }

    // 3. Trigger initial cascade if pre-supplied values exist
    if (initialValues.state) {
      updateDistricts(initialValues.state, initialValues.district || "", initialValues.mandal || "", initialValues.village || "");
    }
  },

  setupCascading(countryEl, stateEl, districtEl, cityEl, initialValues = {}) {
    this.setupFullCascading({
      country: countryEl ? countryEl.value || "India" : "India",
      stateEl: stateEl,
      districtEl: districtEl,
      mandalEl: null,
      villageEl: cityEl,
      initialValues: initialValues
    });
  }
};
