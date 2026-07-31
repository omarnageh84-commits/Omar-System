// database.js - Omar System - محدث بالدروب ليست
let defaultEmployees = ["عم جمال", "عمر", "د.محمد", "د.محمود", "عم احمد", "مدحت"];
let defaultSuppliers = ["بدر", "الفاتح", "بكر", "كريم", "مالك", "المنيسي", "القيصر", "المروه", "كلاستر", "ترند", "مكه", "مشتريات", "اون لاين", "سمارتس", "مستورد", "GTN", "التحرير", "باراديس", "سوفيكو", "ايفا", "مالتي", "رامكو", "كيما", "العامرية", "ايبكو", "سيناء", "المصريه ن", "المصريه", "كورتكسين", "لونا", "سانيتا", "سوتير", "كايروميد", "الحمد", "العالميه", "الباسط", "روز", "ليفر", "كزمو", "السلام", "مكه م", "مستحضرات", "قصر الطب", "الحافظ", "القصر العيني"];
let defaultArba7 = ["فودافون", "انستا", "د.خالد", "ا/محمود", "ام مصطفي", "نجاة", "هند"];
let defaultMasrofat = ["شنط", "نت/ارضي", "المياة", "فكه", "مصروفات", "غاز", "كهرباء", "ضرائب"];

// سيتم تحميل defaultAsnaf من الملف القديم لو موجود، وإلا نستخدم القائمة الافتراضية الكبيرة
let defaultAsnafRaw = [];
try {
  // هذا المتغير سيتم استبداله تلقائياً من الملف القديم إذا وجد
  if (typeof defaultAsnaf !== 'undefined') defaultAsnafRaw = defaultAsnaf;
} catch (e) { }

let defaultAsnaf = [
  ["ابونوف 20 قرص - سعر 110", 110], ["اتاكاند 16 مجم 14 قرص - سعر 116 - (IMP)", 116], ["اتاكاند 16 مجم 14 قرص - سعر 85 - (IMP)", 85], ["اتاكاند 8 مجم 14 قرص - سعر 83 - (IMP)", 83], ["اتاكاند بلس 16/12.5 مجم 14 قرص - سعر 116", 116], ["اتاكاند بلس 32/25 مجم 14 قرص - سعر 179 - (IMP)", 179], ["ارث فري 20 مجم 30 قرص - سعر 261", 261], ["اركوكسيا 90 مجم 14 قرص - سعر 239", 239], ["اريسبت 10 مجم 14 قرص - سعر 360", 360], ["اريسبت 10 مجم 7 قرص - سعر 235", 235], ["اريسيبت 10 مجم 14 قرص - سعر 180", 180], ["اريسيبت 10 مجم 14 قرص - سعر 470", 470], ["اريسيبت 5 مجم 14 قرص - سعر 300", 300], ["اريميدكس 1 مجم 28 قرص - سعر 706 - (IMP)", 706], ["افارا 20 مجم 30 قرص - سعر 483 - (IMP)", 483], ["افاصويا 300 مجم 30 كبسول - سعر 350", 350], ["افودارت 0.5 مجم 30 كبسول-سعر219", 219], ["اكتوس 15 - سعر 210 - (IMP)", 210], ["اكتوس 30 - سعر 372 - (IMP)", 150], ["اكتونكس كيدز 20 مل - سعر 370", 370], ["اكتي - كولا 10 كيس - سعر 258", 258], ["اكتي - كولا سي 30 كيس - سعر 666", 666], ["اكسفورج 160/10 مجم سعر 218 - (IMP)", 218], ["اكسفورج اتش سي تي 10/160/25 مجم سعر 270 - (IMP)", 270], ["اكسفورج اتش سي تي 5/160/12.5 مجم سعر 270 - (IMP)", 270], ["الفافيم 300 مجم 20 كبسول - سعر 160", 160], ["الفافيم 600 مجم 20 كبسول - سعر 290", 290], ["الليرديب بخاخ - سعر 300", 300], ["اليكوس 5 مجم - سعر 532 - (IMP)", 532], ["اليمبوسيسس 5 مجم 30 قرص - سعر 269.25", 269.25], ["انتريستو 100 مجم 28 قرص - سعر 1700 - (IMP)", 1700], ["انتريستو 200 مجم 56 قرص - سعر 3559 - (IMP)", 3559], ["انتريستو 50 مجم 28 قرص - سعر 1700 - (IMP)", 1700], ["انسيلاكوكس 90 مجم 30 قرص - سعر 315", 315], ["انهالكس 30 كبسول - سعر 415", 415], ["انيجي 10/20 مجم 14 قرص-سعر200.25", 200.25], ["اوكساليبتال 300 مجم 30 قرص - سعر 180", 180], ["اوكساليبتال 600 مجم 30 قرص - سعر 180", 303], ["اوميجال الترا 30 كبسول - سعر 210", 210], ["اومينك اوكاس 0.4 - سعر 282 - (IMP)", 282], ["ايزوجاست 40 مجم 14 كبسول - سعر 160", 160], ["ايزوجاست 40 مجم 28 كبسول - سعر 320", 320], ["ايكتونكس كيدز - سعر 370", 370], ["ايكندرا بلس 30 قرص - سعر 147", 147], ["ايكوزاليب 1 جم - سعر276", 276], ["ايمباكوزا بلس 10/5 مجم 30 قرص - سعر 357", 357], ["ايمباكوزا بلس 25/5 مجم 30 قرص - 357", 357], ["اينرا 10 أكياس - سعر 250", 250], ["اينرا 10 أكياس - سعر 300", 300], ["براديبيكت 7.5 مجم 28 قرص - سعر 176", 176], ["بروتولانس 30 مجم - سعر 114", 114], ["بروست ايد 20 كبسول - سعر 83.5", 83.5], ["بروستانورم 30 كبسوله - سعر 165", 165], ["بروستانورم 30 كبسوله - سعر 231", 231], ["بروكورالان 5 مجم 28 قرص - سعر 352 - (IMP)", 352], ["بروكورالان 7.5مجم 28 قرص - سعر352 - (IMP)", 352], ["بريزتري بخاخ 160/9/4.8 مكم 120 جرعه - سعر 1060 - (IMP)", 1060], ["برينتاليكس 10 مجم 14 قرص - سعر 364 - (IMP)", 364], ["برينتاليكس 20 مجم 14 قرص - سعر 573 - (IMP)", 573], ["بلادوجرا 50 مجم 30 قرص - سعر 357", 357], ["بلنديل 5 مجم 30 قرص - سعر 81 - (IMP)", 81], ["بنجيرايد 0.5 مجم 30 كبسول - سعر 123", 123], ["بنجيرايد 0.5 مجم 30 كبسول - سعر 162", 162], ["بولي فريش اكسترا - سعر 185", 185], ["بون كير 1 جرام 30 كبسوله - سعر 132", 132], ["بيبون بلس - سعر 100", 100], ["بيبون بلس 20 كبسول - سعر 150", 150], ["بيتاسيرك 16 مجم 60 قرص - سعر 219", 219], ["بيتاسيرك 24 مجم 40 قرص - سعر 218", 218], ["بيتاسيرك 8 مجم 100 قرص - سعر 160", 160], ["بيتميجا 50 مجم 30 قرص - سعر 498 - (IMP)", 498], ["بيتميجا 50 مجم 30 قرص - سعر 562 - (IMP)", 562], ["بيريليك 90 مجم - سعر 1064 - (IMP)", 1064], ["بيسكالدين 300 مجم 15 كبسول - سعر450 - (IMP)", 450], ["تارج 160مجم 28 قرص - سعر 194", 194], ["تارج 160مجم 28 قرص - سعر 320", 320], ["تارج 320 مجم 10 قرص - سعر 107", 107], ["تارج 80 مجم 14 قرص - سعر 148", 148], ["ترايتون 200 مجم 30 قرص - سعر 123", 123], ["ترايكور 5/5 مجم 10 قرص - سعر 42", 42], ["تريتاس ماكس 10/25 مجم 10 قرص - سعر", 63], ["تويت تير اكس بي - سعر 375", 375], ["تويت تير الليجري- سعر 360", 360], ["تويت تير عادي - سعر 330", 375], ["تيجينت 10 كيس - سعر 160", 160], ["ثيوتاسيد 600 اورجينال 30 قرص - سعر 230 - (IMP)", 230], ["ثيوتاسيد 600 اورجينال 30 قرص - سعر 245 - (IMP)", 245], ["ثيونيرف 300 مجم 20 قر ص -سعر 58", 58], ["جاردينس 25 مجم - سعر 496.5 - (IMP)", 496.5], ["جاستروبيوتيك 550 مجم 20 قرص - سعر 344", 344], ["جاستيكول 20 مجم 14 قرص - سعر 57.5", 57.5], ["جاستيكول 20 مجم 14 قرص - سعر 80", 80], ["جاستيكول 20 مجم 28 قرص - سعر 115", 115], ["جانوفيا 100 مجم 28 قرص - سعر 389 - (IMP)", 389], ["جانوميت 50/1000 مجم 28 قرص - سعر 674 - (IMP)", 674], ["جلوكوفانس 500/5 مجم 30 قرص - سعر 74 - (IMP)", 74], ["جونميرا 10 كيس - سعر 295", 295], ["جوينتا 30 قرص - سعر 340", 340], ["جينوفيل 10 كيس - سعر 280 - (IMP)", 280], ["جينوفيل ادفانس 30 كيس - سعر745 - (IMP)", 745], ["دابابليكس مت 1000/10 مجم 30 قرص - سعر 216", 216], ["داباجليف بلس 10/1000 مجم 30 قرص - سعر 270", 270], ["دافلون 1000 مجم 30 قرص - سعر 354 - (IMP)", 354], ["دالفاروزيس 10 مجم 20 قرص - سعر 352", 352], ["داونستيرولين 10/20 مجم 28 قرص - سعر 122", 122], ["دوسبتالين ريتارد 200 مجم - سعر 138", 138], ["دوكسيرازول 60 مجم 14 كبسول - سعر 72.75", 72.75], ["دونيفوكسات 80 مجم 30 قرص - سعر 118.5", 118.5], ["دي.ديب 10.000 وحده 30 كبسول - سعر 300", 300], ["ديجريزيان 1 جم 28 كبسول - سعر 384", 384], ["ديكسيجلوفوزن 5 مجم 30 قرص - 102", 102], ["روتافلورا 20 كبسول - سعر 200", 200], ["روزفاست 20 مجم 14 قرص - سعر 118", 118], ["روزفاست 20 مجم 14 قرص - سعر 130", 130], ["روزفاست 20 مجم 14 قرص - سعر 88", 88], ["ريستور 20 مجم - سعر 80", 58], ["ريفاروسبير 15 مجم 42 قرص - سعر 534 - (IMP)", 534], ["زيتاكولست 180 مجم 30 قرص - سعر 432", 432], ["زيروفازيت 10/10 مجم 30 قرص - سعر 216", 216], ["زيروفازيت 20/10 مجم 30 قرص - سعر 294", 294], ["زيروفازيت 40/10 مجم 30 قرص - سعر 456", 456], ["سانو جووي 30 كبسول - سعر 165", 165], ["سبيريفا بخاخ - سعر 416 - (IMP)", 416], ["سلفاكس جوينت 30 قرص - سعر 240", 240], ["سمبالتا كبسول 60 مجم 28 كبسول - سعر 544 - (IMP)", 544], ["سمبيكورت 160مجم120جرعه - سعر 332 - (IMP)", 332], ["سمبيكورت 160مجم120جرعه - سعر 432 - (IMP)", 432], ["سمبيكورت 320 مجم 60 جرعه - سعر 432 - (IMP)", 432], ["سنترافيتا بروست 30 كبسول - سعر 295", 295], ["سولفاكس بلس جيل 120 جرام - سعر 110", 110], ["سولفاكس بلس جيل 60 جرام - سعر 85", 85], ["سومازينا نقط 30 مل - سعر 140", 140], ["سي اتش الفا 10 كيس - سعر 275 - (IMP)", 275], ["سي اتش الفا 10 كيس - سعر 295 - (IMP)", 295], ["سي اتش الفا بلس 10 كيس - سعر 295 - (IMP)", 295], ["سي اتش الفا بلس 10 كيس - سعر 350 - (IMP)", 350], ["سي اتش الفا بلس 10 كيس - سعر 370 - (IMP)", 370], ["سيبرابرو 10 مجم - سعر 237", 237], ["سيريتايد 125 مج 25 جرعه - سعر 228 - (IMP)", 228], ["سيريتايد 250 مج 28 جرعه - سعر 141 - (IMP)", 141], ["سيريتايد 250 مج 28 جرعه - سعر 184 - (IMP)", 184], ["سيريتايد 250 مج 60 جرعه - سعر 257 - (IMP)", 257], ["سيريتايد 250 مج 60 جرعه - سعر 335 - (IMP)", 335], ["سيريتايد 500 مجم 60 جرعه - سعر 411 - (IMP)", 411], ["سيستان الترا نقط 10 مل - سعر 360 - (IMP)", 360], ["سيستان قطره عادي - سعر 300 - (IMP)", 300], ["سيستان هيدراشن 10 مل - سعر 390 - (IMP)", 390], ["سيلسبت 500 مجم 50 قرص - سعر 1460 - (IMP)", 1460], ["سيلوسورت 100 مجم 30 قرص - سعر 93", 93], ["سيليبركس 100 مجم 10 كبسول - سعر 48.75", 48.75], ["سيليبريكس 200 مجم 15 كبسول - سعر 198", 198], ["سينجاردي 12.5/1000 مجم 60 قرص - سعر 870 - (IMP)", 870], ["شاركلون 1000 مجم 30 كبسول - سعر 195", 195], ["شاركلون 250 مجم 30 كبسول - سعر 99", 99], ["شاركيلاج بلس 30 كبسول - سعر 150", 150], ["فاتاشي جايد 30 قرص - سعر 285", 285], ["فاجلوزينو 25 مجم 30 قرص - سعر 207", 207], ["فاستاريل ام ار 30 قرص - سعر 175 - (IMP)", 175], ["فانفيلدا بلس 1000/50 مجم 30 قرص - سعر 138", 138], ["فانفيلدا بلس 850/50 مجم 30 قرص - سعر 105", 105], ["فلوموسيل 300 مجم 5 امبول - سعر 262 - (IMP)", 262], ["فلوموسيل 600 مجم 10 قرص - سعر 109 - (IMP)", 109], ["فلوموسيل 600 مجم 10 قرص - سعر 135 - (IMP)", 135], ["فوراديل 60 كبسول - سعر 560", 560], ["فورفلوزين 10 مجم 30 قرص - سعر 306", 306], ["فوركسيجا 10 مجم - سعر 602 - (IMP)", 602], ["فوركسيجا 5 مجم - سعر 602 - (IMP)", 602], ["فورموهال 30 كبسول - سعر 198", 198], ["فوكاستين 250 مجم 60 مل - سعر 110", 110], ["فوكاستين 500 مجم - سعر 330", 330], ["فيتايامي 30 قرص - سعر 135", 135], ["فيروديب 30 كبسول - سعر 295", 295], ["فيزان 2 مجم 28 قرص - سعر 518 - (IMP)", 518], ["فيزيكير 10 مجم - سعر 487 - (IMP)", 487], ["فيزيكير 5 مجم 30 قرص - سعر 377 - (IMP)", 377], ["فيلداجلوز بلس 50/1000 مجم 30 قرص - سعر 147", 147], ["كاردورا 4 مجم 14 قرص - سعر 58", 58], ["كاردورا اكس ال - سعر 255", 255], ["كازودكس 50 مجم 28 قرص - سعر 720 - (IMP)", 720], ["كال بريج دي 30 قرص - سعر 72", 72], ["كريستور 10 مجم 28 قرص - سعر368 - (IMP)", 368], ["كريستور 20 مجم 28 قرص - سعر600 - (IMP)", 600], ["كريستور 5 مجم 28 قرص - سعر264 - (IMP)", 264], ["كريستوليب 10 مجم 30 مجم - سعر 108", 108], ["كريستوليب 20 مجم 30 قرص - سعر 141", 141], ["كورتوبكت 300 مجم 30 كبسول - سعر 150", 150], ["كوفرسيل بلس 5/1.25 مجم 15 قرص - سعر 54", 54], ["كوفرسيل بلس 5/1.25 مجم 15 قرص - سعر 84", 84], ["كوفيرام 10/5 مجم - سعر 139", 139], ["كوفيرام 5/10 مجم 30 قرص - سعر 365", 365], ["كوليروز بلس 20/10 مجم 28 قرص - سعر 276", 276], ["كونفنتين اكس ار 300 مجم 30 قرص - سعر 135", 135], ["كويتابكس 200 مجم 30 قرص - سعر 234", 234], ["كيلفامت 1000 مجم 30 قرص - 84", 84], ["كيلفامت 500 مجم 30 قرص - 54", 54], ["لاروسوزت 10/10 مجم 30 قرص - 156", 156], ["ليبانتيل 145 مجم 20 قرص - سعر 174", 174], ["ليبانتيل 300 مجم 30 قرص - سعر 126", 126], ["ليبانتيل سوبرا 160 مجم 30 قرص - سعر 141", 141], ["ليببترين 10/20 مجم 14 قرص - سعر 130", 130], ["ليببترين 10/40 مجم 14 قرص - سعر 70", 70], ["ليبوكومب 10/10 مجم 30 كبسول - سعر 499", 499], ["ليبيتور 10 مجم 28 قرص - سعر 204", 204], ["ليبيتور 10 مجم 28 قرص - سعر 268", 268], ["ليبيتور 20 مجم 28 قرص - سعر 348", 348], ["ليبيتور 40 مجم 14 قرص - سعر 172", 172], ["ليفاجول 450 مجم 20 كبسول - سعر238", 238], ["ليليبل 10 مجم 20 قرص - سعر 120", 120], ["لينزوليد 600 مجم سعر 232", 232], ["ماكسي كير كريم 75 جرام - سعر 137", 137], ["ماكسيبيم 1 مجم فيال - سعر 108", 108], ["مودابكس 50 مجم 20 قرص - سعر 111", 111], ["موفيجيت 50 مجم 30 قرص - سعر 60", 60], ["موفينتور 20 كبسول - سعر 390", 390], ["موفينتور ادفانس 20 كبسول - سعر 530", 530], ["ميتفورمين اكس ار 1000 مجم 30 قرص - سعر 70.5", 70.5], ["ميرالجو 20 كبسول - سعر 425", 425], ["ميليتوفكس تريو 1000/5/10 مجم 30 قرص - سعر 486", 486], ["ميليتوفكس مت 12.5/1000 مجم 30 قرص - سعر 214.5", 214.5], ["ميليتوفكس مت 5/1000 مجم 30 قرص - سعر 163.5", 163.5], ["ميوكستا 100 مجم 20 قرص - سعر 114", 114], ["نكسيام 40 مجم 28 قرص - سعر 488", 488], ["نورفاسك 10 مجم 15 قرص - 96", 96], ["نولفادكس 10 مجم 30 قرص - سعر 160 - (IMP)", 160], ["نيكسماش 40 مجم 28 كبسول - سعر 220", 220], ["نيكسيروزوفا 20 مجم 14 قرص - سعر 53", 53], ["نيوروروبين - فورت 20 قرص - سعر 46", 46], ["نيوفليكس 60 قرص", 1650], ["هيالو فور ستارت مرهم 30 جرام - سعر 319 - (IMP)", 319], ["وان الفا 0.5 مكم 30 كبسول - سعر178", 178], ["وان الفا 1 مكم 30 كبسول - سعر200", 200], ["يوريكودروب 80 مجم 30 قرص - سعر 90", 90]
];


// ====== FINAL CATEGORIES OVERRIDE ======
const FINAL_CATS = ["مخزن دواء", "شركة دواء", , "عام", "كوزمتكس", "مصاريف"];

let dbStore = JSON.parse(localStorage.getItem('dbStore') || 'null');
if (!dbStore || !dbStore.asnaf) {
  if (!dbStore) dbStore = {};
  dbStore.employees = dbStore.employees || defaultEmployees.map(n => ({ name: n, job: "", hodor: "", insiraf: "", firstDay: "", lastDay: "" }));
  dbStore.suppliers = dbStore.suppliers || defaultSuppliers.map(n => ({ name: n, category: "مخزن دواء" }));
  dbStore.transactions = dbStore.transactions || [{ name: "نقدي" }, { name: "اجل" }];
  dbStore.arba7 = dbStore.arba7 || defaultArba7.map(n => ({ c1: n, c2: "" }));
  dbStore.masrofat = dbStore.masrofat || defaultMasrofat.map(n => ({ c1: n, c2: "" }));
  dbStore.asnaf = defaultAsnaf.map(a => ({ name: a[0], price: a[1] }));
  localStorage.setItem('dbStore', JSON.stringify(dbStore));
}

// تحويل الموظفين القدامى للنظام الجديد
dbStore.employees = (dbStore.employees || []).map(e => {
  if (typeof e === 'string') return { name: e, job: "", hodor: "", insiraf: "", firstDay: "", lastDay: "" };
  return { name: e.name || "", job: e.job || "", hodor: e.hodor || "", insiraf: e.insiraf || "", firstDay: e.firstDay || "", lastDay: e.lastDay || "" };
});
// تحويل الموردين القدامى للنظام الجديد
dbStore.suppliers = (dbStore.suppliers || []).map(s => {
  if (typeof s === 'string') return { name: s, category: "مخزن دواء" };
  let cur = (s.category || s.info || "").toString().trim();
  if (cur.includes('أدوية') || cur.includes('ادوية') || cur.includes('مخزن')) cur = "مخزن دواء";
  if (cur.includes('كوز')) cur = "كوزمتكس";
  if (cur.includes('شرك')) cur = "شركة دواء";
  if (cur.toLowerCase().includes('imp') || cur.includes('مستورد')) cur = "مصاريف";
  if (!FINAL_CATS.includes(cur)) cur = FINAL_CATS[0];
  return { name: s.name, category: cur };
});

function saveDB() { localStorage.setItem('dbStore', JSON.stringify(dbStore)); }

function renderDatabase() {
  let asnafCount = (dbStore.asnaf || []).length;
  document.getElementById('database').innerHTML = `
    <style>
      .db-grid{ display:grid; grid-template-columns: repeat(5, 1fr); gap:10px; align-items:start; }
      .db-card{ background:#fff; border-radius:14px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.04); display:flex; flex-direction:column; height:420px; max-height:420px; }
      .db-card.big{ grid-column: span 2; height:420px; max-height:420px; }
      .db-card.employees{ grid-column: span 2; height:420px; max-height:420px; }
      .db-card.employees .db-body td input{ padding:2px; font-size:10px; }
      .db-head{ padding:10px 12px; color:#fff; font-weight:800; font-size:12px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:2; flex-shrink:0; }
      .db-body{ overflow:auto; flex:1; }
      .db-body table{ width:100%; table-layout:fixed; }
      .db-body th{ font-size:10px; padding:8px 4px; position:sticky; top:0; background:#f8fafc; z-index:1; white-space:nowrap; }
      .db-body td{ height:38px; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .db-body td input, .db-body td select{ font-size:11px; padding:0 4px; width:100%; box-sizing:border-box; }
      @media(max-width:1600px){.db-grid{ grid-template-columns: repeat(3, 1fr); } .db-card.big,.db-card.employees{grid-column: span 2; height:400px;}}
      @media(max-width:900px){.db-grid{ grid-template-columns: repeat(2, 1fr); } .db-card.big,.db-card.employees{grid-column: span 2;}}
      @media(max-width:600px){.db-grid{ grid-template-columns: 1fr; } .db-card,.db-card.big,.db-card.employees{ height:auto; max-height:400px; grid-column: span 1; } }
    </style>
    <div id="dbActions" style="grid-column:1/-1;display:flex;gap:8px;justify-content:flex-end;margin-bottom:6px">
      <button onclick="saveAllDB()" style="background:#0f172a;color:#fff;border:none;padding:7px 16px;border-radius:8px;font-weight:800;font-size:11px;cursor:pointer">💾 حفظ الكل</button>
      <button onclick="resetAllDB()" style="background:#fff;color:#dc2626;border:1.5px solid #fecdd3;padding:7px 16px;border-radius:8px;font-weight:800;font-size:11px;cursor:pointer">♻️ تهيئة القواعد</button>
    </div>
    <div class="db-grid">
      <div class="db-card employees">
        <div class="db-head" style="background:#0f172a">👨‍⚕️ الموظفين (${dbStore.employees.length}) <div><span onclick="addDBRow('employees')" style="cursor:pointer;background:#fff;color:#000;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('employees')" style="cursor:pointer;background:#22c55e;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th style="width:18%">الاسم</th><th style="width:15%">الوظيفة</th><th style="width:14%">الحضور</th><th style="width:14%">الانصراف</th><th style="width:14%">أول يوم</th><th style="width:14%">آخر يوم</th><th style="width:5%">✖</th></tr></thead><tbody id="db-employees"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#0f766e">🏪 الموردين (${dbStore.suppliers.length}) <div><span onclick="addDBRow('suppliers')" style="cursor:pointer;background:#fff;color:#0f766e;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('suppliers')" style="cursor:pointer;background:#0f172a;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th style="width:60%">اسم المورد/المصروف</th><th style="width:32%">التصنيف</th><th style="width:8%">✖</th></tr></thead><tbody id="db-suppliers"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#7c3aed">💳 المعاملات <div><span onclick="addDBRow('transactions')" style="cursor:pointer;background:#fff;color:#7c3aed;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('transactions')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>المعاملة</th><th>✖</th></tr></thead><tbody id="db-transactions"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#f59e0b;color:#000">💰 الارباح (${dbStore.arba7.length}) <div><span onclick="addDBRow('arba7')" style="cursor:pointer;background:#000;color:#fff;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('arba7')" style="cursor:pointer;background:#fff;color:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>المعلومة</th><th>✖</th></tr></thead><tbody id="db-arba7"></tbody></table></div>
      </div>
      <div class="db-card">
        <div class="db-head" style="background:#dc2626">💸 المصروفات (${dbStore.masrofat.length}) <div><span onclick="addDBRow('masrofat')" style="cursor:pointer;background:#fff;color:#dc2626;padding:3px 7px;border-radius:6px">+</span> <span onclick="saveDBTable('masrofat')" style="cursor:pointer;background:#000;padding:3px 7px;border-radius:6px">💾</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th>الاسم</th><th>المعلومة</th><th>✖</th></tr></thead><tbody id="db-masrofat"></tbody></table></div>
      </div>
      <div class="db-card big">
        <div class="db-head" style="background:linear-gradient(135deg,#0f172a,#1e40af)">💊 الاصناف (${asnafCount}) <input id="asnafSearch" oninput="filterAsnaf(this.value)" placeholder="🔍 ابحث عن صنف..." style="padding:6px 10px;border-radius:8px;border:none;width:180px;font-size:12px;color:#000"><div><span onclick="addDBRow('asnaf')" style="cursor:pointer;background:#fff;color:#000;padding:3px 8px;border-radius:6px">+ إضافة</span> <span onclick="saveDBTable('asnaf')" style="cursor:pointer;background:#22c55e;padding:3px 8px;border-radius:6px">💾 حفظ</span></div></div>
        <div class="db-body"><table class="pro-table"><thead><tr><th style="width:75%">الاسم</th><th style="width:20%">السعر</th><th style="width:5%">✖</th></tr></thead><tbody id="db-asnaf"></tbody></table></div>
      </div>
    </div>
  `;
  loadDBTables();
}

function loadDBTables() {
  ['employees', 'suppliers', 'transactions', 'arba7', 'masrofat', 'asnaf'].forEach(t => {
    let tb = document.getElementById(`db-${t}`);
    if (!tb) return;
    tb.innerHTML = '';
    (dbStore[t] || []).forEach(d => addDBRow(t, d));
  });
}

function addDBRow(type, data) {
  let tbody = document.getElementById(`db-${type}`);
  if (!tbody) return;
  let tr = document.createElement('tr'); tr.className = 'asnaf-row';
  if (type === 'employees') {
    let row = data || { name: '', job: '', hodor: '', insiraf: '', firstDay: '', lastDay: '' };
    tr.innerHTML = `<td><input value="${(row.name || '').replace(/"/g, '&quot;')}" placeholder="الاسم"></td>
      <td><input value="${(row.job || '').replace(/"/g, '&quot;')}" placeholder="الوظيفة"></td>
      <td><input value="${row.hodor || ''}" placeholder="حضور" type="text" inputmode="numeric"></td>
      <td><input value="${row.insiraf || ''}" placeholder="انصراف" type="text" inputmode="numeric"></td>
      <td><input value="${row.firstDay || ''}" placeholder="أول يوم 1/7" type="text" style="font-size:11px" inputmode="numeric"></td>
      <td><input value="${row.lastDay || ''}" placeholder="آخر يوم 1/7" type="text" style="font-size:11px" inputmode="numeric"></td>
      <td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  } else if (type === 'suppliers') {
    let cur = (data?.category || data?.info || '').toString().trim();
    if (cur.includes('أدوية') || cur.includes('ادوية') || cur.includes('مخزن')) cur = 'مخزن دواء';
    if (cur.includes('كوز')) cur = 'كوزمتكس';
    if (cur.includes('شرك')) cur = 'شركة دواء';
    if (cur.toLowerCase().includes('imp') || cur.includes('مستورد')) cur = 'مصاريف';
    if (!FINAL_CATS.includes(cur)) cur = FINAL_CATS[0];
    let opts = FINAL_CATS.map(c => `<option value="${c}" ${c === cur ? 'selected' : ''}>${c}</option>`).join('');
    // الترتيب الجديد: اسم المورد يمين، التصنيف شمال
    tr.innerHTML = `
      <td><input value="${(data?.name || '').replace(/"/g, '&quot;')}" style="width:100%;padding:6px;text-align:center;font-weight:700" onblur="saveDBTable('suppliers')"></td>
      <td><select style="width:100%;padding:6px;background:#ecfdf5;border:1.5px solid #0f766e;border-radius:6px;font-weight:800;text-align:center" onchange="saveDBTable('suppliers')">${opts}</select></td>
      <td style="text-align:center"><span style="color:red;cursor:pointer;font-weight:900" onclick="this.closest('tr').remove();saveDBTable('suppliers')">✖</span></td>
    `;
  } else if (type === 'transactions') {
    let row = data || { name: '' };
    tr.innerHTML = `<td><input value="${row.name || ''}" placeholder="المعاملة"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  } else if (type === 'asnaf') {
    let row = data || { name: '', price: '' };
    tr.innerHTML = `<td><input value="${(row.name || '').replace(/"/g, '&quot;')}" placeholder="اسم الصنف"></td><td><input value="${row.price || ''}" placeholder="السعر" type="number" style="font-weight:800;background:#f0fdf4"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  } else {
    let row = data || { c1: '', c2: '' };
    tr.innerHTML = `<td><input value="${row.c1 || ''}" placeholder="الاسم"></td><td><input value="${row.c2 || ''}" placeholder="المعلومة"></td><td><span style="cursor:pointer;color:#dc2626;font-weight:800" onclick="this.closest('tr').remove();saveDBTable('${type}')">✖</span></td>`;
  }
  tbody.appendChild(tr);
}

function saveDBTable(type) {
  let tbody = document.getElementById(`db-${type}`); if (!tbody) return;
  let arr = [];
  tbody.querySelectorAll('tr').forEach(tr => {
    if (type === 'suppliers') {
      let name = tr.children[0]?.querySelector('input')?.value.trim();
      let cat = tr.children[1]?.querySelector('select')?.value;
      if (name) arr.push({ name, category: cat });
    } else if (type === 'employees') {
      let inputs = tr.querySelectorAll('input');
      if (inputs[0]?.value.trim()) arr.push({ name: inputs[0].value.trim(), job: inputs[1]?.value || '' });
    } else if (type === 'transactions') {
      let v = tr.querySelector('input')?.value.trim();
      if (v) arr.push({ name: v });
    } else if (type === 'asnaf') {
      let inputs = tr.querySelectorAll('input');
      let n = inputs[0]?.value.trim();
      let p = inputs[1]?.value.trim();
      if (n) arr.push({ name: n, price: p });
    } else {
      let inputs = tr.querySelectorAll('input');
      let c1 = inputs[0]?.value.trim();
      let c2 = inputs[1]?.value.trim();
      if (c1 || c2) arr.push({ c1: c1, c2: c2 });
    }
  });
  dbStore[type] = arr;
  saveDB();
  if (type !== 'asnaf') { /* لا تعيد الرسم الكامل للاصناف */ }
}

function saveAllDB() {
  ["employees", "suppliers", "transactions", "arba7", "masrofat", "asnaf"].forEach(t => saveDBTable(t));
  alert(`✅ اتحفظت كل القواعد (${dbStore.suppliers.length} مورد)`);
}
function resetAllDB() {
  if (confirm('⚠️ هتمسح كل قواعد البيانات وترجعها للافتراضي؟')) {
    localStorage.removeItem('dbStore'); location.reload();
  }
}
function filterAsnaf(q) {
  q = (q || '').toLowerCase();
  document.querySelectorAll('#db-asnaf tr').forEach(tr => {
    let txt = tr.querySelector('input')?.value?.toLowerCase() || '';
    tr.style.display = txt.includes(q) ? '' : 'none';
  });
}


// ====== فورمات الطريقة بتاعتنا - Omar ======
function formatDateOmar(val) {
  if (!val) return val;
  val = val.toString().trim().replace(/-/g, '/').replace(/\s+/g, '');
  let parts = val.split('/');
  if (parts.length === 1 && !isNaN(parts[0]) && parts[0] !== '') {
    // لو كتب رقم واحد بس اعتبره يوم في الشهر الحالي
    return parts[0] + '/%d/2026'.replace('%d', new Date().getMonth() + 1);
  }
  if (parts.length === 2) {
    let d = parts[0], m = parts[1];
    if (!d || !m) return val;
    // لو الشهر أكبر من 12 بدل
    if (parseInt(m) > 12 && parseInt(d) <= 12) { let t = d; d = m; m = t; }
    return `${parseInt(d)}/${parseInt(m)}/2026`;
  }
  if (parts.length === 3) {
    let d = parts[0], m = parts[1], y = parts[2];
    if (y.length === 2) y = '20' + y;
    if (y.length !== 4) y = '2026';
    return `${parseInt(d)}/${parseInt(m)}/${y}`;
  }
  return val;
}

function formatTimeOmar(val) {
  if (!val) return val;
  val = val.toString().trim().toLowerCase().replace('ص', '').replace('م', '').replace('am', '').replace('pm', '').trim();
  if (!val) return '';
  let h = 0, m = 0;
  if (val.includes(':')) {
    let p = val.split(':');
    h = parseInt(p[0]) || 0; m = parseInt(p[1]) || 0;
  } else {
    h = parseInt(val) || 0; m = 0;
  }
  if (h > 23) h = 23; if (m > 59) m = 59;
  let isPM = h >= 12;
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  let mm = m.toString().padStart(2, '0');
  return `${h12}:${mm} ${isPM ? 'م' : 'ص'}`;
}

function formatNumberOmar(val) {
  if (val === null || val === '') return val;
  let clean = val.toString().replace(/,/g, '').replace(/[^0-9.-]/g, '');
  if (clean === '' || isNaN(clean)) return val;
  let parts = clean.split('.');
  parts[0] = Number(parts[0]).toLocaleString('en-US');
  return parts.join('.');
}

function unformatNumberOmar(val) {
  if (!val) return val;
  return val.toString().replace(/,/g, '');
}

// تطبيق تلقائي على كل الجدول
document.addEventListener('focusout', function (e) {
  let inp = e.target;
  if (inp.tagName !== 'INPUT') return;

  // تاريخ أول يوم وآخر يوم
  if (inp.placeholder && (inp.placeholder.includes('أول يوم') || inp.placeholder.includes('آخر يوم'))) {
    // لو المستخدم استخدم date picker سيبه، لو كتب يدوي فورمات
    if (inp.type === 'date' && inp.value.includes('-')) {
      // input type date بيرجع YYYY-MM-DD نحوله لـ D/M/YYYY للعرض
      let p = inp.value.split('-');
      inp.type = 'text';
      inp.value = `${parseInt(p[2])}/${parseInt(p[1])}/${p[0]}`;
    } else if (inp.value.includes('/')) {
      inp.value = formatDateOmar(inp.value);
    }
    if (inp.closest('tr')) setTimeout(() => saveDBTable('employees'), 100);
  }

  // وقت حضور وانصراف
  if (inp.type === 'time' || (inp.placeholder && (inp.placeholder.includes('حضور') || inp.placeholder.includes('انصراف')))) {
    if (inp.value) {
      if (inp.type === 'time') {
        // حول time input لـ text مع ص/م
        let p = inp.value.split(':');
        let h = parseInt(p[0]) || 0, m = parseInt(p[1]) || 0;
        inp.type = 'text';
        inp.value = formatTimeOmar(`${h}:${m}`);
      } else {
        inp.value = formatTimeOmar(inp.value);
      }
      if (inp.closest('tr')) setTimeout(() => saveDBTable('employees'), 100);
    }
  }

  // أسعار الأصناف
  if (inp.placeholder && inp.placeholder.includes('السعر')) {
    if (inp.value) {
      // احفظ القيمة بدون فاصلة في الداتا، بس اعرض بفاصلة
      let raw = unformatNumberOmar(inp.value);
      inp.dataset.raw = raw;
      inp.value = formatNumberOmar(raw);
      if (inp.closest('tr')) setTimeout(() => saveDBTable('asnaf'), 100);
    }
  }
});

document.addEventListener('focusin', function (e) {
  let inp = e.target;
  if (inp.tagName !== 'INPUT') return;
  // عند التركيز شيل الفورمات عشان الكتابة
  if (inp.placeholder && inp.placeholder.includes('السعر')) {
    inp.value = unformatNumberOmar(inp.value);
  }
  if (inp.placeholder && (inp.placeholder.includes('حضور') || inp.placeholder.includes('انصراف'))) {
    if (inp.value.includes('ص') || inp.value.includes('م')) {
      // حول 7:00 ص -> 07:00 للـ time picker
      let v = inp.value.replace('ص', '').replace('م', '').trim();
      let isPM = inp.value.includes('م');
      let p = v.split(':');
      let h = parseInt(p[0]) || 0, m = p[1] || '00';
      if (inp.value.includes('م') && h !== 12) h += 12;
      if (inp.value.includes('ص') && h === 12) h = 0;
      inp.type = 'time';
      inp.value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
  }
  if (inp.placeholder && (inp.placeholder.includes('أول يوم') || inp.placeholder.includes('آخر يوم'))) {
    if (inp.value.includes('/')) {
      let p = inp.value.split('/');
      if (p.length === 3) {
        inp.type = 'date';
        inp.value = `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
      }
    }
  }
});

// فورمات عند الحفظ
const originalSaveDBTable = saveDBTable;
saveDBTable = function (type) {
  if (type === 'asnaf') {
    document.querySelectorAll('#db-asnaf tr').forEach(tr => {
      let priceInp = tr.children[1]?.querySelector('input');
      if (priceInp && priceInp.value) {
        priceInp.dataset.raw = unformatNumberOmar(priceInp.value);
      }
    });
  }
  if (type === 'employees') {
    document.querySelectorAll('#db-employees tr').forEach(tr => {
      let inputs = tr.querySelectorAll('input');
      // لو التاريخ مكتوب 1/7 حوله
      if (inputs[4]?.value && inputs[4].value.includes('/') && !inputs[4].value.match(/\d{4}/)) {
        inputs[4].value = formatDateOmar(inputs[4].value);
      }
      if (inputs[5]?.value && inputs[5].value.includes('/') && !inputs[5].value.match(/\d{4}/)) {
        inputs[5].value = formatDateOmar(inputs[5].value);
      }
    });
  }
  return originalSaveDBTable(type);
};

// تعديل حفظ الأصناف ليحفظ بدون فواصل
const originalSaveDBTable2 = saveDBTable;
saveDBTable = function (type) {
  let tbody = document.getElementById(`db-${type}`); if (!tbody) return;
  let arr = [];
  tbody.querySelectorAll('tr').forEach(tr => {
    if (type === 'suppliers') {
      let name = tr.children[0]?.querySelector('input')?.value.trim();
      let cat = tr.children[1]?.querySelector('select')?.value;
      if (name) arr.push({ name, category: cat });
    } else if (type === 'employees') {
      let inputs = tr.querySelectorAll('input');
      let name = inputs[0]?.value.trim();
      if (name) {
        let firstDay = inputs[4]?.value || '';
        let lastDay = inputs[5]?.value || '';
        // حول التاريخ لو ناقص سنة
        if (firstDay && firstDay.match(/^\d+\/\d+$/)) firstDay = formatDateOmar(firstDay);
        if (lastDay && lastDay.match(/^\d+\/\d+$/)) lastDay = formatDateOmar(lastDay);
        arr.push({
          name: name,
          job: inputs[1]?.value || '',
          hodor: inputs[2]?.value || '',
          insiraf: inputs[3]?.value || '',
          firstDay: firstDay,
          lastDay: lastDay
        });
      }
    } else if (type === 'transactions') {
      let v = tr.querySelector('input')?.value.trim();
      if (v) arr.push({ name: v });
    } else if (type === 'asnaf') {
      let inputs = tr.querySelectorAll('input');
      let n = inputs[0]?.value.trim();
      let pRaw = inputs[1]?.dataset?.raw || unformatNumberOmar(inputs[1]?.value || '');
      if (n) arr.push({ name: n, price: pRaw });
    } else {
      let inputs = tr.querySelectorAll('input');
      let c1 = inputs[0]?.value.trim();
      let c2 = inputs[1]?.value.trim();
      if (c1 || c2) arr.push({ c1: c1, c2: c2 });
    }
  });
  dbStore[type] = arr;
  saveDB();
  // إعادة عرض الفورمات بعد الحفظ
  if (type === 'asnaf') {
    setTimeout(() => {
      document.querySelectorAll('#db-asnaf tr').forEach(tr => {
        let inp = tr.children[1]?.querySelector('input');
        if (inp && inp.dataset.raw) inp.value = formatNumberOmar(inp.dataset.raw);
      });
    }, 50);
  }
}

console.log('✅ فورمات الطريقة بتاعتنا اتفعلت: تاريخ 1/7→1/7/2026، وقت 7→7:00ص، رقم 10000→10,000');

