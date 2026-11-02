/* =====================================================================
   HANZT 2027 網站內容資料區 —— 網站上所有文字、日期、金額都在這裡改
   ---------------------------------------------------------------------
   怎麼改：
   1. 用 VS Code 或記事本打開本檔（js/config.js），按 Ctrl+F 搜尋「待填」，逐一換成正式內容。
      網頁上沒填的地方會用黃底標出〔待填〕，打開網站就知道哪裡還沒改。
   2. 只改引號 "…" 裡面的字，不要刪掉引號、逗號、括號。
   3. 日期一律寫 "YYYY-MM-DD"（例如 "2027-05-07"）。
   4. 下載連結留空 "" 時，按鈕會自動顯示「準備中」。
   5. {zh:"中文", en:"English"} 是中英兩種語言；只寫一個字串代表中英共用。
   6. 每一區開頭的 [A]、[B]… 對應《內容修改指南》裡的章節。
   ===================================================================== */
const CONFIG = {

  /* [A] 後端網址：Apps Script 部署網址；留空＝展示模式（不會真的送出） */
  apiUrl: "https://script.google.com/macros/s/AKfycbx4f0BKXTFgO9olyDipbyyb40vB7nJ8YgGm-8KoNQLjiHvfWXlErfdFi5YzQl-jYCo9Uw/exec",

  /* [B] 會議基本資訊（首頁、頁首、頁尾、海報區都會用到） */
  edition: 22, year: 2027, short: "HANZT 2027",
  title: {zh:"2027 國際氫能應用與淨零科技研討會", en:"International Conference on Hydrogen Application and Net Zero Technologies"},
  subtitle: {zh:"第二十二屆・技術論壇與學術研討會", en:"22nd edition · Technology Forum & Academic Conference"},
  start: "2027-06-18", end: "2027-06-19", openTime: "09:00",
  venue: {zh:"國立成功大學 光復校區 國際會議廳", en:"International Conference Hall, Kuang-Fu Campus, National Cheng Kung University"},
  address: {zh:"臺南市東區大學路1號", en:"No. 1, Daxue Rd., East Dist., Tainan City, Taiwan"},
  banquet: {zh:"台南遠東香格里拉（臺南市東區大學路西段89號，會場對面）", en:"Shangri-La's Far Eastern Plaza Hotel, Tainan (No. 89, Daxue W. Rd., across from the venue)"},
  banquetMapQuery: "台南遠東香格里拉 臺南市東區大學路西段89號",   // 晚宴地點的 Google 地圖搜尋字
    showH2Car: true,   // 氫能車競賽：不辦就改成 false，整個頁面會消失

  /* [C] 下載與外部連結（貼上 Google 雲端硬碟等分享網址；留空＝顯示「準備中」） */
  links: {
    sponsorForm:"",        // 贊助辦法與申請表
    agendaPdf:"",          // 議程 PDF
    handbook:"",           // 大會手冊
    briefing:"",           // 行前通知
    photos:"",             // 活動照片
    awards:"",             // 得獎名單
    templateZh:"", templateEn:"",               // 一般投稿範本（中／英）
    templateStudentZh:"", templateStudentEn:"", // 學生競賽範本（中／英）
    templatePoster:"",     // 海報張貼範本
    copyright:"",          // 著作權授權書
    h2carRegister:""       // 氫能車參賽報名表
  },

  /* [D] 重要日程（首頁時間軸、徵稿頁截止卡片）
     tbd:true 會顯示「暫定」；確定後刪掉 tbd:true。
     展延時加上 extendedTo:"新日期"，網頁會自動顯示「舊日期劃線 → 新日期」。 */
  dates: [
    {label:{zh:"論文徵稿開始",en:"Call for papers opens"}, start:"2027-03-01", tbd:true},
    {label:{zh:"早鳥註冊",en:"Early-bird registration"}, start:"2027-03-01", end:"2027-05-31", tbd:true},
    {label:{zh:"一般論文／海報投稿截止",en:"Oral & poster submission deadline"}, start:"2027-05-07", tbd:true, deadline:true},
    {label:{zh:"學生論文競賽投稿截止",en:"Student competition deadline"}, start:"2027-05-21", tbd:true, deadline:true},
    {label:{zh:"一般註冊（線上報名截止）",en:"Regular registration (online closes)"}, start:"2027-06-01", end:"2027-06-17", tbd:true},
    {label:{zh:"大會舉行／現場註冊",en:"Conference & on-site registration"}, start:"2027-06-18", end:"2027-06-19"}
  ],

  /* [E] 最新消息（首頁消息列表與頁首跑馬燈）
     cat 分類：general 公告／cfp 徵稿／reg 註冊／agenda 議程／notice 行前通知／award 得獎
     pin:true＝置頂。新增一則就複製一行改內容。 */
  news: [
    {date:"2026-10-20", cat:"general", pin:true, title:"HANZT 2027 網站上線", text:"〔待填〕網站上線公告內容"},
    {date:"2026-10-20", cat:"cfp", title:"〔待填〕徵稿公告標題", text:"〔待填〕徵稿公告內容"},
    {date:"2026-10-20", cat:"reg", title:"〔待填〕註冊公告標題", text:"〔待填〕註冊公告內容"},
    {date:"2026-10-20", cat:"agenda", title:"〔待填〕議程公告標題", text:"〔待填〕議程公告內容"}
  ],

  /* [F] 會議介紹（首頁「關於」、會議資訊頁） */
  about: {
    zh:"氫能是淨零轉型中發電、運輸與工業部門的重要能源選項。2027 國際氫能應用與淨零科技研討會（HANZT 2027）為第二十二屆，於國立成功大學舉辦，邀集學界、研究機構與產業，交流氫能生產、儲運、燃料電池、系統整合與淨零技術的最新成果，並透過技術論壇與學生論文競賽促進產學合作與人才培育。",
    en:"Hydrogen is a key option for decarbonising power, transport and industry. HANZT 2027, the 22nd edition of the conference, is held at National Cheng Kung University and brings academia, research institutes and industry together on hydrogen production, storage, fuel cells, system integration and net-zero technology, with a technology forum and a student paper competition."
  },
  goals: [   // 大會目標（會議資訊頁四張卡）
    [{zh:"技術交流",en:"Exchange"},"〔待填〕技術交流目標說明"],
    [{zh:"產學媒合",en:"Industry links"},"〔待填〕產學媒合目標說明"],
    [{zh:"人才培育",en:"Talent"},"〔待填〕人才培育目標說明"],
    [{zh:"政策對話",en:"Policy"},"〔待填〕政策對話目標說明"]
  ],
  highlights: [   // 活動亮點（首頁「關於」下方三欄）
    [{zh:"技術交流",en:"Technical exchange"},"〔待填〕亮點說明"],
    [{zh:"產學媒合",en:"Industry forum"},"〔待填〕亮點說明"],
    [{zh:"學生競賽",en:"Student awards"},"〔待填〕亮點說明"]
  ],

  /* [G] 主協辦單位（首頁 logo 區、頁尾）。第 2 組是主辦、第 3 組是合辦，頁尾會引用 */
  organizers: [
    {role:{zh:"指導單位",en:"Supervised by"}, items:["〔待填〕指導單位"]},
    {role:{zh:"主辦單位",en:"Organized by"}, items:["台灣氫能與燃料電池學會"]},
    {role:{zh:"合辦／承辦單位",en:"Hosted by"}, items:["國立成功大學 航空太空工程學系"]},
    {role:{zh:"協辦單位",en:"Co-organized by"}, items:["〔待填〕協辦單位"]}
  ],
  /* 贊助商名稱（首頁與贊助頁的 logo 輪播）。目前是虛構樣品，正式名單確定後替換 */
  sponsors: ["Sample Energy","示範氫能（樣品）","Demo Fuel Cell","樣品能源（樣品）","Placeholder H₂","Example Power","範例電池（樣品）","Mock Stack Inc."],

  /* [H] 組織架構（會議資訊頁）：[職稱, 姓名, 單位] */
  committeeKey: [
    ["榮譽主任委員","〔待填〕姓名","〔待填〕單位職稱"],
    ["主任委員","〔待填〕姓名","〔待填〕單位職稱"],
    ["副主任委員","〔待填〕姓名","〔待填〕單位職稱"],
    ["總幹事","〔待填〕姓名","〔待填〕單位職稱"],
    ["秘書長","〔待填〕姓名","〔待填〕單位職稱"]
  ],
  workgroups: [   // [組別, 負責人, 主要工作]
    ["論文組","〔待填〕負責人","學生論文競賽、論文收集、海報論文"],
    ["議程組","〔待填〕負責人","議程安排、邀請演講、一般論文"],
    ["場地組","〔待填〕負責人","場地商借、會場布置、平面圖與交通指引"],
    ["財務組","〔待填〕負責人","預算與核銷、匯款帳號、收據與發票"],
    ["廠商組","〔待填〕負責人","接洽廠商、贊助與參展專區"],
    ["宣傳組","〔待填〕負責人","網站設計與更新、海報與通知"],
    ["補助申請","〔待填〕負責人","國科會等補助申請"]
  ],
  members: ["〔待填〕委員姓名｜單位","〔待填〕委員姓名｜單位","〔待填〕委員姓名｜單位","〔待填〕委員姓名｜單位"],

  /* [I] 大會講者（講者頁）：time 寫 "YYYY-MM-DD HH:MM" */
  keynotes: [
    {name:"〔待填〕講者 1 姓名", org:"〔待填〕單位職稱", title:"〔待填〕演講題目", time:"2027-06-19 10:10", chair:"〔待填〕引言人", bio:"〔待填〕講者簡介", abs:"〔待填〕演講摘要"},
    {name:"〔待填〕講者 2 姓名", org:"〔待填〕單位職稱", title:"〔待填〕演講題目", time:"2027-06-19 10:40", chair:"〔待填〕引言人", bio:"〔待填〕講者簡介", abs:"〔待填〕演講摘要"},
    {name:"〔待填〕講者 3 姓名", org:"〔待填〕單位職稱", title:"〔待填〕演講題目", time:"2027-06-19 11:20", chair:"〔待填〕引言人", bio:"〔待填〕講者簡介", abs:"〔待填〕演講摘要"}
  ],

  /* [J] 兩日議程（議程頁）：[開始, 結束, 類型, 標題, 說明]
     類型決定顏色：keynote 大會演講／forum 論壇／paper 論文／break 休息／social 餐敘／ceremony 典禮 */
  agenda: [
    {day:"2027-06-18", name:{zh:"技術論壇",en:"Technology Forum"}, items:[
      ["09:00","09:10","ceremony",{zh:"論壇開幕致詞",en:"Forum opening"},""],
      ["09:10","09:40","forum",{zh:"論壇演講 1",en:"Forum talk 1"},"〔待填〕講者／單位｜講題"],
      ["09:40","10:10","forum",{zh:"論壇演講 2",en:"Forum talk 2"},"〔待填〕講者／單位｜講題"],
      ["10:10","10:40","forum",{zh:"論壇演講 3",en:"Forum talk 3"},"〔待填〕講者／單位｜講題"],
      ["10:40","10:50","break",{zh:"茶敘",en:"Coffee break"},""],
      ["10:50","11:50","forum",{zh:"論壇演講 4–5",en:"Forum talks 4–5"},"〔待填〕講者／單位｜講題"],
      ["11:50","13:30","break",{zh:"午餐",en:"Lunch"},""],
      ["13:30","15:00","forum",{zh:"論壇演講 6–8",en:"Forum talks 6–8"},"〔待填〕講者／單位｜講題"],
      ["15:00","15:20","break",{zh:"茶敘",en:"Coffee break"},""],
      ["15:20","16:50","forum",{zh:"論壇演講 9–11",en:"Forum talks 9–11"},"〔待填〕講者／單位｜講題"],
      ["16:50","17:00","ceremony",{zh:"閉幕致詞",en:"Closing"},""],
      ["18:00","20:30","social",{zh:"VIP 邀請晚宴",en:"VIP dinner"},"〔待填〕地點"]
    ]},
    {day:"2027-06-19", name:{zh:"學術研討會",en:"Conference"}, items:[
      ["08:30","09:00","break",{zh:"報到",en:"Registration"},""],
      ["09:00","10:00","ceremony",{zh:"開幕典禮／致詞／會員大會／合照",en:"Opening ceremony & AGM"},"〔待填〕地點"],
      ["10:00","10:10","break",{zh:"茶敘",en:"Coffee break"},""],
      ["10:10","10:40","keynote",{zh:"大會演講 I",en:"Plenary I"},"〔待填〕講者 1"],
      ["10:40","11:10","keynote",{zh:"大會演講 II",en:"Plenary II"},"〔待填〕講者 2"],
      ["11:10","11:20","break",{zh:"茶敘・海報開放張貼",en:"Break · poster set-up"},""],
      ["11:20","11:50","keynote",{zh:"大會演講 III",en:"Plenary III"},"〔待填〕講者 3"],
      ["11:50","13:20","break",{zh:"午餐／學會理監事會議",en:"Lunch / board meeting"},""],
      ["13:20","17:00","paper",{zh:"一般論文發表・學生論文競賽・海報競賽",en:"Oral papers · Student competition · Posters"},"〔待填〕各會場"],
      ["18:00","20:30","social",{zh:"大會晚宴暨頒獎",en:"Banquet & awards"},"台南遠東香格里拉（會場對面）"]
    ]}
  ],

  /* [K] 逐篇論文發表時間（議程頁後三個分頁）：[編號, 時間, 題目, 作者, 地點]
     編號格式和投稿系統一致：GP 一般／SC 學生／PO 海報＋領域兩碼＋流水號 */
  papers: {
    oral: [
      ["GP01-001","13:20–13:35","〔待填〕論文題目","〔待填〕作者","〔待填〕會議室"],
      ["GP02-001","13:20–13:35","〔待填〕論文題目","〔待填〕作者","〔待填〕會議室"]
    ],
    student: [
      ["SC01-001","13:25–13:35","〔待填〕論文題目","〔待填〕作者","〔待填〕會議室"],
      ["SC02-001","13:25–13:35","〔待填〕論文題目","〔待填〕作者","〔待填〕會議室"]
    ],
    poster: [
      ["PO01-001","13:20–15:30","〔待填〕海報題目","〔待填〕作者","〔待填〕張貼位置"]
    ]
  },

  /* [L] 投稿主題（徵稿頁、投稿表單的領域選單）。key 是領域代號，請勿更動 */
  topics: [
    {key:"1", area:{zh:"領域一：氫能技術",en:"Area 1: Hydrogen Technology"}, items:[
      ["H1",{zh:"氫能經濟技術與產業發展",en:"Hydrogen economy & industry"},{zh:"氫能應用與生態和環境的問題、氫能應用安全問題、氫能經濟、氫能分析。",en:"Ecology, environment and safety of hydrogen applications; hydrogen economy and analysis."}],
      ["H2",{zh:"氫的生產技術",en:"Hydrogen production"},{zh:"綠氫、藍氫、灰氫、褐氫等產氫技術開發；水電解產氫與轉能（P2G）。",en:"Green, blue, grey and brown hydrogen production; water electrolysis and power-to-gas (P2G)."}],
      ["H3",{zh:"氫的運輸、儲存與純化",en:"Transport, storage & purification"},{zh:"固定式、流動性儲氫系統、物理化學儲氫（含金屬氫化物）、氣體純化、PSA 與 Membrane 分離純化、氫能品質。",en:"Stationary and mobile storage, physical/chemical storage incl. metal hydrides, gas conditioning, PSA and membrane purification, hydrogen quality."}]
    ]},
    {key:"2", area:{zh:"領域二：燃料電池",en:"Area 2: Fuel Cells"}, items:[
      ["F1",{zh:"基礎研究（新材料、新技術、新模型）",en:"Fundamentals"},{zh:"多孔電極多重物理量耦合、雙極板流場最佳化、觸媒與膜電極組製程與結構最佳化、微尺度燃料電池。",en:"Multiphysics in porous electrodes, bipolar-plate flow-field optimisation, catalyst and MEA processing and structure, micro fuel cells."}],
      ["F2",{zh:"BOP（Balance of Plant）分析",en:"Balance of Plant"},{zh:"電池堆設計與組裝、水管理、散熱與回熱、燃料與空氣供應次系統、氫氣回收系統。",en:"Stack design and assembly, water management, thermal management and heat recovery, fuel and air supply subsystems, hydrogen recirculation."}],
      ["F3",{zh:"AI 電能分析與管理、系統整合與應用",en:"AI power management & integration"},{zh:"AI 電力輸出動態響應分析、熱電合併（CHP）、混合電力系統、發電機／車輛／3C 應用、新型 SOFC 系統整合。",en:"AI-based dynamic power analysis, combined heat and power (CHP), hybrid power systems, applications in generators, vehicles and 3C products, new SOFC system integration."}],
      ["F4",{zh:"檢測技術",en:"Testing & diagnostics"},{zh:"操作條件最佳化、接觸阻抗與親疏水性等表面特性檢測、快速耐久性測試。",en:"Operating-condition optimisation, surface property testing (contact resistance, wettability), accelerated durability testing."}]
    ]},
    {key:"3", area:{zh:"領域三：淨零排放、碳捕捉與其他能源議題",en:"Area 3: Net zero & other energy topics"}, items:[
      ["O",{zh:"其他相關能源議題",en:"Other energy topics"},{zh:"淨零排放、碳捕捉、生物燃料電池、電動車輛、智慧綠能控制、風能、鋰電池、地熱、生質能、太陽能電池、冷凍空調、能源管理與經濟、建築節能、智慧製造等。",en:"Net zero, carbon capture, biofuel cells, EVs, smart green-energy control, wind, Li-ion batteries, geothermal, biomass, solar cells, HVAC, energy management and economics, building efficiency, smart manufacturing and more."}]
    ]}
  ],
  formats: [   // 投稿格式與規定（徵稿頁）
    [{zh:"一般論文",en:"Oral paper"},"〔待填〕篇幅規定（例：1 頁摘要）"],
    [{zh:"學生論文競賽",en:"Student competition"},"〔待填〕篇幅規定（例：至少 4 頁）"],
    [{zh:"海報競賽",en:"Poster competition"},"〔待填〕摘要規定與海報尺寸"]
  ],
  prizes: [["第一名","〔待填〕獎金"],["第二名","〔待填〕獎金"],["第三名","〔待填〕獎金"],["海報競賽","〔待填〕獎項說明"]],

  /* [M] 註冊費用（註冊頁表格、費用試算、投稿表單金額）
     conf 依 feeCats 順序：一般、學生、國際一般(USD)、國際學生(USD)；forum 為論壇費（NTD）
     ⚠ 金額和截止日要跟後端 Code.gs 的 CFG 一致 */
  feeCats: [{zh:"一般人士（學研／業界）",en:"Domestic"},{zh:"學生（需附證明）",en:"Domestic student"},{zh:"國際一般",en:"International"},{zh:"國際學生",en:"International student"}],
  feeCur: ["NTD","NTD","USD","USD"],
  feeStages: [
    {name:{zh:"早鳥報名",en:"Early bird"}, start:"2027-03-01", end:"2027-05-31", conf:[4200,3500,350,250], forum:2000},
    {name:{zh:"一般報名",en:"Regular"}, start:"2027-06-01", end:"2027-06-17", conf:[4700,3900,400,300], forum:2500},
    {name:{zh:"現場報名",en:"On-site"}, start:"2027-06-18", end:"2027-06-19", conf:[4900,4200,420,320], forum:3000}
  ],
  bank: [["銀行／郵局","〔待填〕"],["分行","〔待填〕"],["代號","〔待填〕"],["帳號","〔待填〕"],["戶名","〔待填〕"]],
  refund: "〔待填〕取消與退費規定",

  /* [N] 常見問題（FAQ 頁）：[問題, 回答]；新增一題就複製一行 */
  faq: [
    {cat:{zh:"論文發表注意事項",en:"Presenting"}, items:[
      ["學生論文競賽的發表時間？","〔待填〕發表時間與報到規定"],
      ["一般論文的發表時間？","〔待填〕發表時間"],
      ["海報如何張貼？","〔待填〕海報列印、張貼與拆除規定"],
      ["評分標準是什麼？","〔待填〕學生論文與海報競賽評分比例"]
    ]},
    {cat:{zh:"投稿",en:"Submitting"}, items:[
      ["可以用英文投稿嗎？","〔待填〕投稿語言規定"],
      ["摘要字數限制？","〔待填〕摘要字數限制"],
      ["一定要用大會範本嗎？","〔待填〕範本使用規定"],
      ["無法出席怎麼辦？","〔待填〕代理發表規定"]
    ]},
    {cat:{zh:"投稿系統操作",en:"Using the system"}, items:[
      [{zh:"線上投稿怎麼操作？",en:"How do I submit online?"},{zh:"在「線上投稿」選擇報名模式、填寫資料並上傳 PDF。送出後系統會寄出確認信，信中有編號與 5 位數驗證碼；沒收到請先檢查垃圾郵件匣。",en:"On \"Submit\", choose a registration type, fill in the form and upload your PDF. You will receive a confirmation email with your ID and a 5-digit code; check your spam folder if it does not arrive."}],
      [{zh:"如何修改稿件？",en:"How do I revise my paper?"},{zh:"到「稿件與匯款管理」輸入投稿 Email 與驗證碼，即可修改題目、作者、摘要、關鍵字與重新上傳 PDF。投稿截止後無法修改。",en:"Go to \"Manage submission\" and sign in with your email and code. You can edit the title, authors, abstract and keywords and upload a new PDF until the submission deadline."}],
      [{zh:"如何回報匯款？",en:"How do I pay?"},{zh:"登入「稿件與匯款管理」後付款：國內身分可用綠界線上付款（信用卡、ATM、超商），或匯款後回報末 5 碼；國際身分以 PayPal 支付美金。",en:"Sign in to \"Manage submission\". Domestic participants can pay by credit card, ATM or convenience store via ECPay, or report a bank transfer; international participants pay in USD via PayPal."}],
      [{zh:"怎麼知道繳費完成？",en:"How do I know my payment is confirmed?"},{zh:"線上付款完成後系統會自動確認並寄出通知信；匯款則由工作人員確認後寄出通知信。登入管理頁也能看到繳費狀態。",en:"Online payments are confirmed automatically and you will receive a confirmation email. Bank transfers are confirmed by staff, after which an email is sent. Your status is also shown in \"Manage submission\"."}],
      [{zh:"費用怎麼計算？",en:"How are fees calculated?"},{zh:"依轉帳日期判斷早鳥、一般或現場級距。可先用「註冊費用」頁的費用試算器估算。",en:"Fees follow the payment date (early bird, regular or on-site). Use the fee calculator on the Fees page for an estimate."}]
    ]},
    {cat:{zh:"交通與住宿",en:"Travel"}, items:[
      [{zh:"建議怎麼到會場？",en:"How do I get to the venue?"},{zh:"搭台鐵到「台南站」，從後站出口出站，左轉大學路步行至成大光復校區。搭高鐵者請在高鐵台南站轉乘沙崙線到台南站。詳見「交通住宿」頁。",en:"Take the train to Tainan Station, leave by the rear exit and walk along Daxue Rd. to NCKU Kuang-Fu Campus. From THSR Tainan, transfer to the Shalun Line. See Travel & venue for details."}],
      ["可以開車嗎？","〔待填〕停車資訊"],
      [{zh:"附近有住宿嗎？",en:"Are there hotels nearby?"},{zh:"請參考「交通住宿」頁的建議住宿。",en:"See the recommended hotels on the Travel & venue page."}]
    ]}
  ],

  /* [O] 會場與交通（交通住宿頁） */
  floors: [   // [樓層, 用途, [教室…]]
    ["1F","〔待填〕用途（例：主場地、報到、廠商展示）",["〔待填〕教室編號"]],
    ["2F","〔待填〕用途（例：一般論文、海報）",["〔待填〕教室編號"]],
    ["3F","〔待填〕用途（例：學生論文競賽）",["〔待填〕教室編號"]]
  ],
  transport: [   // [方式, 說明, 是否顯示「待確認」]
    [{zh:"台鐵",en:"Train (TRA)"},{zh:"搭到「台南站」，從後站出口出站，左轉大學路步行至成大光復校區（〔待填〕步行約幾分鐘）。",en:"Get off at Tainan Station, leave by the rear exit and turn left onto Daxue Rd. to NCKU Kuang-Fu Campus (〔待填〕 walking time)."},false],
    [{zh:"高鐵",en:"High-speed rail"},{zh:"高鐵台南站走 2 樓連通道或 1 樓 1 號出口至台鐵沙崙站，搭沙崙線到「台南站」，再依台鐵路線步行。",en:"From THSR Tainan, use the 2F corridor or 1F Exit 1 to TRA Shalun Station, take the Shalun Line to Tainan Station, then walk as above."},false],
    [{zh:"開車",en:"By car"},{zh:"國道一號南下由大灣交流道、北上由仁德交流道下，往市區方向行駛。",en:"National Freeway 1: southbound exit at Dawan, northbound exit at Rende, then head into the city."},false],
    [{zh:"停車",en:"Parking"},"〔待填〕校內或周邊停車場資訊",false],
    [{zh:"公車",en:"Bus"},"〔待填〕公車路線與站名",false],
    [{zh:"桃園機場（國際旅客）",en:"From Taoyuan Airport"},{zh:"搭機場捷運至高鐵桃園站，轉高鐵到台南站，再轉沙崙線到台鐵台南站。",en:"Airport MRT to THSR Taoyuan, THSR to Tainan, then the Shalun Line to TRA Tainan Station."},false],
    [{zh:"高雄小港機場（國際旅客）",en:"From Kaohsiung Airport"},{zh:"搭高雄捷運紅線至高雄車站或新左營站，轉台鐵北上到台南站。",en:"Kaohsiung MRT Red Line to Kaohsiung Main Station or Xinzuoying, then TRA north to Tainan Station."},false]
  ],
  /* Google 地圖：mapQuery 是地圖要搜尋的地點名稱，嵌入地圖與「在 Google 地圖開啟」按鈕都用它 */
  mapQuery: "國立成功大學光復校區 國際會議廳",
  venueDetail: "〔待填〕會場建築名稱與入口位置",
  hotels: [   // [名稱, 距離, 備註]
    ["台南遠東香格里拉","會場對面","大會晚宴地點；〔待填〕是否有大會優惠房價"],
    ["〔待填〕飯店名稱","〔待填〕距離","〔待填〕備註"],
    ["〔待填〕飯店名稱","〔待填〕距離","〔待填〕備註"]
  ],
  sights: [   // 台南旅遊：[中文名, 英文名, 介紹]
    ["赤崁樓","Chihkan Tower","〔待填〕景點介紹"],
    ["臺南孔子廟","Confucius Temple","〔待填〕景點介紹"],
    ["安平古堡","Anping Old Fort","〔待填〕景點介紹"],
    ["神農街","Shennong Street","〔待填〕景點介紹"]
  ],

  /* [P] 聯絡與贊助（聯絡贊助頁） */
  contacts: [
    {role:{zh:"大會聯絡人",en:"Conference contact"}, name:"〔待填〕姓名", email:"〔待填〕Email", phone:"〔待填〕電話"},
    {role:{zh:"贊助商聯絡人",en:"Sponsorship contact"}, name:"〔待填〕姓名", email:"〔待填〕Email", phone:"〔待填〕電話"}
  ],
  packages: [   // [方案名稱, 內容, 金額]
    [{zh:"廣告刊登",en:"Advertising"},"〔待填〕方案內容（例：大會手冊 A4 廣告一頁）","〔待填〕金額"],
    [{zh:"標準展示",en:"Standard booth"},"〔待填〕方案內容","〔待填〕金額"],
    [{zh:"重點展示",en:"Premium booth"},"〔待填〕方案內容","〔待填〕金額"],
    [{zh:"參展加購",en:"Extra staff"},"〔待填〕方案內容","〔待填〕金額"],
    [{zh:"單純贊助",en:"Supporter"},"〔待填〕方案內容","〔待填〕金額"]
  ],
  booth: [["攤位規格","〔待填〕尺寸與桌椅"],["攤位權益","〔待填〕註冊人數、餐點"],["網站曝光","〔待填〕曝光方式"],["申請截止","〔待填〕日期"]],

  /* [Q] 氫能車競賽（showH2Car 為 true 才會顯示） */
  h2car: {rules:["〔待填〕競賽日期與地點","〔待填〕車輛規定","〔待填〕組別與獎項"], deadline:"〔待填〕報名截止日", schedule:"〔待填〕競賽議程"},

  /* [R] 往屆網站（頁尾） */
  pastSites: [["HEFC 2026","https://sites.google.com/view/2026hefc"],["HEFC 2025","https://sites.google.com/view/hefc2025/home"],["HEFC 2024","https://sites.google.com/view/hefc2024"]]
};
