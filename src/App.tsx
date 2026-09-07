import React, { useState, useEffect } from 'react';
import './App.css';

// assets 이미지 불러오기
import pic1 from './assets/pic1.jpg';
import pic2 from './assets/pic2.jpg';
import pic3 from './assets/pic3.jpg';

interface BibleVerse {
  km: string;
  kr: string;
  refKm: string;
  refKr: string;
}

interface GospelStation {
  id: number;
  titleKm: string;
  titleKr: string;
  descKm: string;
  descKr: string;
  verseKm: string;
  verseKr: string;
  verseTextKm: string;
  verseTextKr: string;
}

interface UsefulLink {
  nameKm: string;
  nameKr: string;
  descKm: string;
  descKr: string;
  url: string;
  category: string;
}

interface RoomBill {
  id: number;
  name: string;
  usage: number;
  cost: number;
}

interface KoreanStudyItem {
  id: number;
  kr: string;
  kmPron: string;
  kmMeaning: string;
  enMeaning: string;
}

// 40개의 한국어 학습 데이터베이스 (캄보디아어 / KSV 기준)
const koreanStudyDatabase: KoreanStudyItem[] = [
  { id: 1, kr: "안녕하세요", kmPron: "อัน-นย็อง-ฮา-เซ-โย", kmMeaning: "ជម្រាបសួរ (ជំរាបសួរ)", enMeaning: "Hello" },
  { id: 2, kr: "감사합니다", kmPron: "คัม-ซา-ฮัม-นิ-ดา", kmMeaning: "អរគុណ", enMeaning: "Thank you" },
  { id: 3, kr: "죄송합니다", kmPron: "ชเว-ซง-ฮัม-นิ-ดา", kmMeaning: "សុំទោស", enMeaning: "Sorry" },
  { id: 4, kr: "예수님", kmPron: "เย-ซู-นิม", kmMeaning: "ព្រះយេស៊ូវ", enMeaning: "Jesus" },
  { id: 5, kr: "사랑", kmPron: "ซา-รัง", kmMeaning: "សេចក្តីស្រឡាញ់", enMeaning: "Love" },
  { id: 6, kr: "은혜", kmPron: "อึน-เฮ", kmMeaning: "ព្រះគុណ", enMeaning: "Grace" },
  { id: 7, kr: "축복합니다", kmPron: "ชุก-บก-ฮัม-นิ-ดา", kmMeaning: "សូមព្រះប្រទានពរ", enMeaning: "God bless you" },
  { id: 8, kr: "기도", kmPron: "คี-โด", kmMeaning: "ការអធិស្ឋាន", enMeaning: "Prayer" },
  { id: 9, kr: "믿음", kmPron: "มี-ดึม", kmMeaning: "ជំនឿ", enMeaning: "Faith" },
  { id: 10, kr: "소망", kmPron: "โซ-มัง", kmMeaning: "សេចក្តីសង្ឃឹម", enMeaning: "Hope" },
  { id: 11, kr: "얼마예요?", kmPron: "ออล-มา-เย-โย?", kmMeaning: "ថ្លៃប៉ុន្មាន?", enMeaning: "How much is it?" },
  { id: 12, kr: "어디예요?", kmPron: "ออ-ดิ-เย-โย?", kmMeaning: "នៅឯណា?", enMeaning: "Where is it?" },
  { id: 13, kr: "도와주세요", kmPron: "โท-วา-จู-เซ-โย", kmMeaning: "សូមជួយខ្ញុំផង", enMeaning: "Please help me" },
  { id: 14, kr: "네 / 아니요", kmPron: "เน / อา-นี-โย", kmMeaning: "បាទ/ចាស / ទេ", enMeaning: "Yes / No" },
  { id: 15, kr: "괜찮아요", kmPron: "แควน-ชา-นา-โย", kmMeaning: "មិនអីទេ", enMeaning: "It's okay" },
  { id: 16, kr: "전기세", kmPron: "ชอน-กี-เซ", kmMeaning: "ថ្លៃអគ្គិសនី", enMeaning: "Electricity bill" },
  { id: 17, kr: "월세", kmPron: "วอล-เซ", kmMeaning: "ថ្លៃឈ្នួលផ្ទះប្រចាំខែ", enMeaning: "Monthly rent" },
  { id: 18, kr: "수도세", kmPron: "ซู-โด-เซ", kmMeaning: "ថ្លៃទឹក", enMeaning: "Water bill" },
  { id: 19, kr: "영수증", kmPron: "ย็อง-ซู-จึง", kmMeaning: "វិក្កយបត្រ", enMeaning: "Receipt" },
  { id: 20, kr: "계좌번호", kmPron: "กเย-จวา-บอน-โฮ", kmMeaning: "លេខគណនី", enMeaning: "Account number" },
  { id: 21, kr: "밥 먹었어요?", kmPron: "พับ ม็อก-ออส-ซอ-โย?", kmMeaning: "ញ៉ាំបាយហើយឬនៅ?", enMeaning: "Have you eaten?" },
  { id: 22, kr: "맛있어요", kmPron: "มา-ชิ-ซอ-โย", kmMeaning: "ឆ្ងាញ់ណាស់", enMeaning: "It's delicious" },
  { id: 23, kr: "어디 가요?", kmPron: "ออ-ดิ กา-โย?", kmMeaning: "ទៅណា?", enMeaning: "Where are you going?" },
  { id: 24, kr: "집에 가요", kmPron: "ชิบ-เบ กา-โย", kmMeaning: "ទៅផ្ទះ", enMeaning: "Going home" },
  { id: 25, kr: "오늘", kmPron: "โอ-นึล", kmMeaning: "ថ្ងៃនេះ", enMeaning: "Today" },
  { id: 26, kr: "내일", kmPron: "เน-อิล", kmMeaning: "ថ្ងៃស្អែក", enMeaning: "Tomorrow" },
  { id: 27, kr: "주일 (일요일)", kmPron: "ชู-อิล (อิล-โย-อิล)", kmMeaning: "ថ្ងៃអាទិត្យ", enMeaning: "Sunday" },
  { id: 28, kr: "교회", kmPron: "กโย-ฮเว", kmMeaning: "ព្រះវិហារ", enMeaning: "Church" },
  { id: 29, kr: "성경", kmPron: "ซ็อง-กย็อง", kmMeaning: "ព្រះគម្ពីរ", enMeaning: "Bible" },
  { id: 30, kr: "찬양", kmPron: "ชัน-ยัง", kmMeaning: "ការសរសើរតម្កើង", enMeaning: "Praise" },
  { id: 31, kr: "평안하세요", kmPron: "พย็อง-อัน-ฮา-เซ-โย", kmMeaning: "សូមឱ្យមានសន្តិភាព", enMeaning: "Peace be with you" },
  { id: 32, kr: "수고하셨습니다", kmPron: "ซู-โก-ฮา-ชยอส-ซึม-นิ-ดา", kmMeaning: "អរគុណសម្រាប់ការខិតខំប្រឹងប្រែង", enMeaning: "Good job / Thank you" },
  { id: 33, kr: "천국", kmPron: "ชอน-กุก", kmMeaning: "ស្ថានសួគ៌", enMeaning: "Heaven" },
  { id: 34, kr: "구원", kmPron: "กู-วอน", kmMeaning: "ការសង្គ្រោះ", enMeaning: "Salvation" },
  { id: 35, kr: "친구", kmPron: "ชิน-กู", kmMeaning: "មិត្តភក្តិ", enMeaning: "Friend" },
  { id: 36, kr: "병원", kmPron: "พย็อง-วอน", kmMeaning: "មន្ទីរពេទ្យ", enMeaning: "Hospital" },
  { id: 37, kr: "약국", kmPron: "ยัก-กุก", kmMeaning: "ឱសថស្ថាន", enMeaning: "Pharmacy" },
  { id: 38, kr: "아파요", kmPron: "อา-พา-โย", kmMeaning: "ឈឺ", enMeaning: "It hurts / Sick" },
  { id: 39, kr: "피곤해요", kmPron: "พี-กน-แฮ-โย", kmMeaning: "ហត់ណាស់", enMeaning: "Tired" },
  { id: 40, kr: "행복하세요", kmPron: "แฮง-บก-ฮา-เซ-โย", kmMeaning: "សូមឱ្យមានសេចក្តីសុខ", enMeaning: "Be happy" }
];

// 복음 지하철 노선도 (KSV 성경 기준 캄보디아어)
const gospelRoute: GospelStation[] = [
  {
    id: 1,
    titleKm: "1. การបង្កើត (ការបង្កើត)",
    titleKr: "1. 창조",
    descKm: "ព្រះជាម្ចាស់បានបង្កើតសកលលោក មនុស្សលោក និងអ្វីៗទាំងអស់យ៉ាងល្អប្រពៃ។",
    descKr: "하나님께서 세상과 인간을 아름답게 창조하셨습니다.",
    verseKm: "លោកុប្បត្តិ 1:1",
    verseKr: "창세기 1:1",
    verseTextKm: "នៅដើមដំបូង ព្រះជាម្ចាស់បានបង្កើតផ្ទៃមេឃ និងផែនដី។",
    verseTextKr: "태초에 하나님이 천지를 창조하시니라"
  },
  {
    id: 2,
    titleKm: "2. អំពើបាប (អំពើបាប)",
    titleKr: "2. 죄",
    descKm: "មនុស្សបានបោះបង់ចោលព្រះជាម្ចាស់ ហើយធ្លាក់ចូលទៅក្នុងអំពើបាប។",
    descKr: "인간이 하나님을 떠나 죄에 빠졌습니다.",
    verseKm: "រ៉ូម 3:23",
    verseKr: "โรมาสาร 3:23",
    verseTextKm: "ដ្បិតមនុស្សទាំងអស់បានធ្វើបាប ហើយខ្វះសិរីល្អរបស់ព្រះជាម្ចាស់។",
    verseTextKr: "모든 사람이 죄를 범하였으매 하나님의 영광에 이르지 못하더니"
  },
  {
    id: 3,
    titleKm: "3. ផលនៃអំពើបាបគឺសេចក្តីស្លាប់",
    titleKr: "3. 죄의 결과 죽음",
    descKm: "ឈ្នួលនៃអំពើបាបគឺសេចក្តីស្លាប់ និងការបាត់បង់ដ៏អស់កល្ប។",
    descKr: "죄의 대가는 영원한 죽음과 절망입니다.",
    verseKm: "រ៉ូម 6:23",
    verseKr: "โรมาสาร 6:23",
    verseTextKm: "ដ្បិតឈ្នួលនៃអំពើបាបគឺសេចក្ដីស្លាប់ ប៉ុន្តែអំណោយទានទទេរបស់ព្រះជាម្ចាស់ គឺជីវិតអស់កល្បជានិច្ចនៅក្នុងព្រះគ្រីស្ទយេស៊ូវ ជាព្រះអម្ចាស់នៃយើង។",
    verseTextKr: "죄의 삯은 사망이요 하나님의 은사는 그리스도 예수 우리 주 안에 있는 영생이니라"
  },
  {
    id: 4,
    titleKm: "4. ព្រះអង្គសង្គ្រោះ (ព្រះយេស៊ូវ)",
    titleKr: "4. 구원자 (예수님)",
    descKm: "ព្រះជាម្ចាស់បានចាត់ព្រះយេស៊ូវគ្រីស្ទឱ្យយាងមកធ្វើជាព្រះអង្គសង្គ្រោះ។",
    descKr: "하나님께서 예수 그리스도를 구원자로 보내셨습니다.",
    verseKm: "យូហាន 3:16",
    verseKr: "โยฮัน 3:16",
    verseTextKm: "ដ្បិតព្រះជាម្ចាស់ស្រឡាញ់មនុស្សលោកខ្លាំងណាស់ រហូតដល់បានប្រទានព្រះរាជបុត្រាតែមួយគត់របស់ព្រះអង្គ ដើម្បីឱ្យអ្នកណាដែលជឿលើព្រះរាជបុត្រានោះ មិនត្រូវវិនាសឡើយ ប៉ុន្តែមានជីវិតអស់កល្បជានិច្ច។",
    verseTextKr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"
  },
  {
    id: 5,
    titleKm: "5. ការសុគតជំនួសយើង",
    titleKr: "5. 대신 죽으심",
    descKm: "ព្រះយេស៊ូវបានទទួលរងទោសបាប និងសុគតនៅលើឈើឆ្កាងជំនួសយើង។",
    descKr: "예수님이 우리 죄를 위해 십자가에서 대신 죽으셨습니다.",
    verseKm: "រ៉ូម 5:8",
    verseKr: "โรมาสาร 5:8",
    verseTextKm: "ប៉ុន្តែ ព្រះជាម្ចាស់បានបង្ហាញសេចក្ដីស្រឡាញ់របស់ព្រះអង្គចំពោះយើង គឺនៅពេលដែលយើងនៅជាអ្នកធ្វើបាបនៅឡើយ ព្រះគ្រីស្ទបានសុគតជួសយើង។",
    verseTextKr: "우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라"
  },
  {
    id: 6,
    titleKm: "6. ការសង្គ្រោះ",
    titleKr: "6. 구원",
    descKm: "យើងទទួលបានការអត់ទោសបាប និងទទួលបានជីវិតអស់កល្បជានិច្ចជាអំណោយទាន។",
    descKr: "죄 사함을 받고 영원한 생명을 선물로 받습니다.",
    verseKm: "អេភេសូរ 2:8",
    verseKr: "เอเบซัส 2:8",
    verseTextKm: "ដ្បិតគឺដោយសារព្រះគុណហើយ ដែលអ្នករាល់គ្នាត្រូវបានសង្គ្រោះតាមរយៈជំនឿ ហើយនេះមិនមែនកើតចេញពីអ្នករាល់គ្នាឡើយ គឺជារង្វាន់របស់ព្រះជាម្ចាស់។",
    verseTextKr: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라"
  },
  {
    id: 7,
    titleKm: "7. ជំនឿ",
    titleKr: "7. 믿음",
    descKm: "យើងទទួលបានការសង្គ្រោះដោយសារការជឿ និងទទួលស្វាគមន៍ព្រះយេស៊ូវនៅក្នុងចិត្ត។",
    descKr: "예수님을 마음으로 믿고 영접함으로 구원에 이릅니다.",
    verseKm: "រ៉ូម 10:10",
    verseKr: "โรมาสาร 10:10",
    verseTextKm: "ដ្បិតមនុស្សជឿដោយចិត្ត នាំឱ្យបានសុចរិត ហើយប្រកាសដោយមាត់ នាំឱ្យបានសង្គ្រោះ។",
    verseTextKr: "사람이 마음으로 믿어 의에 이르이고 입으로 시인하여 구원에 이르느니라"
  },
  {
    id: 8,
    titleKm: "8. ព្រះគ្រីស្ទនឹងយាងមកវិញ",
    titleKr: "8. 다시 오실 그리스도",
    descKm: "ព្រះយេស៊ូវនឹងយាងមកវិញ ដើម្បីបំពេញរាជ្យរបស់ព្រះជាម្ចាស់ឱ្យបានសម្រេចជាស្ថាពរ។",
    descKr: "예수님이 다시 오셔서 영원한 하나님 나라를 완성하십니다.",
    verseKm: "វេរវរណៈ 22:20",
    verseKr: "โยฮันเคชิรก 22:20",
    verseTextKm: "ព្រះអង្គដែលធ្វើបន្ទាល់អំពីការទាំងនេះ មានព្រះបន្ទូលថា៖ «មែនហើយ យើងនឹងមកយ៉ាងឆាប់!»។ អាម៉ែន! ព្រះអម្ចាស់យេស៊ូវអើយ សូមយាងមក!",
    verseTextKr: "이것들을 증언하신 이가 이르시되 내가 진실로 속히 오리라 하시거늘 아멘 주 예수여 오시옵소서"
  }
];

const bibleVerses: BibleVerse[] = [
  { km: "ដ្បិតព្រះជាម្ចាស់ស្រឡាញ់មនុស្សលោកខ្លាំងណាស់ រហូតដល់បានប្រទានព្រះរាជបុត្រាតែមួយគត់របស់ព្រះអង្គ", kr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", refKm: "(យូហាន 3:16)", refKr: "(요 3:16)" },
  { km: "ព្រះយេហូវ៉ាទ្រង់ជាអ្នកគង្វាលខ្ញុំ ខ្ញុំគ្មានខ្វះអ្វីឡើយ", kr: "여호와는 나의 목자시니 내게 부족함이 없으리로다", refKm: "(ទំនុកតម្កើង 23:1)", refKr: "(시 23:1)" },
  { km: "អស់អ្នកដែលនឿយហត់ និងរែកបន្ទុកធ្ងន់អើយ ចូរមកឯខ្ញុំ ខ្ញុំនឹងឱ្យអ្នករាល់គ្នាបានសម្រាក", kr: "수고하고 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", refKm: "(ម៉ាថាយ 11:28)", refKr: "(มธ 11:28)" },
  { km: "ចូរទុកចិត្តលើព្រះយេហូវ៉ាឱ្យអស់ពីចិត្ត ហើយកុំពឹងផ្អែកលើការយល់ដឹងរបស់ខ្លួនឡើយ", kr: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라", refKm: "(សុភាសិត 3:5)", refKr: "(잠 3:5)" },
  { km: "ចូរទទួលស្គាល់ទ្រង់នៅក្នុងគ្រប់ផ្លូវរបស់អ្នក ហើយទ្រង់នឹងតម្រង់ផ្លូវរបស់អ្នក", kr: "너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라", refKm: "(សុភាសិត 3:6)", refKr: "(잠 3:6)" },
  { km: "កុំខ្លាចឡើយ ដ្បិតយើងនៅជាមួយអ្នក កុំតក់ស្លុតឡើយ ដ្បិតយើងជាព្រះរបស់អ្នក", kr: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라", refKm: "(អេសាយ 41:10)", refKr: "(사 41:10)" },
  { km: "ខ្ញុំអាចធ្វើអ្វីៗទាំងអស់បាន ដោយសារព្រះអង្គដែលប្រទានកម្លាំងដល់ខ្ញុំ", kr: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", refKm: "(ភីលីព 4:13)", refKr: "(빌 4:13)" },
  { km: "ហើយព្រះនៃខ្ញុំ នឹងបំពេញគ្រប់សេចក្តីត្រូវការរបស់អ្នករាល់គ្នា តាមសិរីល្អដ៏ស្តុកស្តម្ភរបស់ព្រះអង្គនៅក្នុងព្រះគ្រីស្ទយេស៊ូវ", kr: "나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라", refKm: "(ភីលីព 4:19)", refKr: "(빌 4:19)" },
  { km: "កុំខ្វល់ខ្វាយអំពីអ្វីឡើយ ប៉ុន្តែនៅក្នុងគ្រប់កិច្ចការទាំងអស់ ចូរជម្រាបសេចក្តីត្រូវការរបស់អ្នកទៅព្រះជាម្ចាស់តាមរយៈការអធិស្ឋាន", kr: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", refKm: "(ភីលីព 4:6)", refKr: "(빌 4:6)" },
  { km: "ហើយសន្តិសុខរបស់ព្រះជាម្ចាស់ ដែលហួសពីការយល់ដឹងទាំងឡាយ នឹងការពារចិត្ត និងគំនិតរបស់អ្នករាល់គ្នានៅក្នុងព្រះគ្រីស្ទយេស៊ូវ", kr: "그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", refKm: "(ភីលីព 4:7)", refKr: "(빌 4:7)" }
];

// 울산 캄보디아 노동자를 위한 필수 웹사이트 10선 (캄보디아 대사관 포함)
const usefulLinks: UsefulLink[] = [
  {
    nameKm: "ប្រព័ន្ធ HiKorea (ហៃកូរ៉េ)",
    nameKr: "하이코리아 (출입국 민원)",
    descKm: "កក់ការណាត់ជួប កាតស្នាក់នៅ និងពន្យារប័ណ្ណទិដ្ឋាការ/ផ្លាស់ប្តូរអាសយដ្ឋាន",
    descKr: "비자 연장, 주소지 변경, 출입국 방문 예약",
    url: "https://www.hikorea.go.kr",
    category: "ទិដ្ឋាការ / Visa"
  },
  {
    nameKm: "ប្រព័ន្ធ EPS (ការងារ)",
    nameKr: "EPS 외국인고용",
    descKm: "ពិនិត្យមើលកិច្ចសន្យាការងារ សិទ្ធិ និងការផ្លាស់ប្តូរកន្លែងធ្វើការ",
    descKr: "근로계약서, 체류기간 및 이직 내역 조회",
    url: "https://www.eps.go.kr",
    category: "ពលកម្ម / Labour"
  },
  {
    nameKm: "មជ្ឈមណ្ឌលគាំទ្រពលករបរទេសអ៊ុលសាន",
    nameKr: "울산외국인주민지원센터",
    descKm: "ការប្រឹក្សាផ្នែកច្បាប់ដោយឥតគិតថ្លៃ និងការបកប្រែភាសាខ្មែរនៅអ៊ុលសាន",
    descKr: "울산 지역 무료 법률·노무 상담 및 한국어 교육",
    url: "http://usfr.or.kr",
    category: "អ៊ុលសាន / Ulsan"
  },
  {
    nameKm: "ស្ថានទូតកម្ពុជាប្រចាំសាធារណរដ្ឋកូរ៉េ (Seoul)",
    nameKr: "주한 캄보디아 대사관",
    descKm: "សេវាលិខិតឆ្លងដែន (Passport) និងកិច្ចការកុងស៊ុលកម្ពុជា",
    descKr: "캄보디아 여권 재발급, 영사 및 행정 서비스",
    url: "https://www.cambodiaembassy.kr",
    category: "ស្ថានទូត / Embassy"
  },
  {
    nameKm: "បេឡាជាតិសន្តិសុខសង្គម/ធានារ៉ាប់រងសុខភាព (NHIS)",
    nameKr: "국민건강보험공단",
    descKm: "ពិនិត្យមើលសិទ្ធិទទួលបានការថែទាំសុខភាព និងការបង់ប្រាក់ភាគទាន",
    descKr: "외국인 건강보험 자격, 보험료 및 병원 안내",
    url: "https://www.nhis.or.kr",
    category: "សុខភាព / Medical"
  },
  {
    nameKm: "អង្គភាពសំណងគ្រោះថ្នាក់ការងារ (KCOMWEL)",
    nameKr: "근로복지공단 (산재보험)",
    descKm: "ការដាក់ពាក្យសុំសំណងនៅពេលមានជំងឺ ឬរបួសដោយសារការងារ",
    descKr: "산업재해(산재) 신청 및 미지급 임금 대지급금",
    url: "https://www.comwel.or.kr",
    category: "សិទ្ធិ / Welfare"
  },
  {
    nameKm: "អង្គភាពអភិវឌ្ឍន៍ធនធានមនុស្សកូរ៉េ (HRD Korea)",
    nameKr: "한국산업인력공단 (EPS)",
    descKm: "ការទាមទារប្រាក់ធានារ៉ាប់រងត្រឡប់ទៅប្រទេសវិញ និងប្រាក់បំពេញការងារ",
    descKr: "귀국비용보험, 출국만기보험 신청 및 수령 안내",
    url: "https://www.hrdkorea.or.kr",
    category: "ធានារ៉ាប់រង / Insurance"
  },
  {
    nameKm: "គេហទំព័រសស្វែងរកការងារ Work24 (고용24)",
    nameKr: "고용24 (구 워크넷)",
    descKm: "ស្វែងរកការងារធ្វើដោយស្របច្បាប់ និងទទួលបានអត្ថប្រយោជន៍ផ្សេងៗ",
    descKr: "공식 구직 및 채용 정보, 고용보험 서비스",
    url: "https://www.work24.go.kr",
    category: "ការងារ / Jobs"
  },
  {
    nameKm: "មជ្ឈមណ្ឌលចរាចរណ៍អ៊ុលសាន (រថយន្តក្រុង)",
    nameKr: "울산교통관리센터 (버스정보)",
    descKm: "ពិនិត្យមើលម៉ោងរថយន្តក្រុងនៅអ៊ុលសានសម្រាប់ការធ្វើដំណើរទៅធ្វើការ",
    descKr: "울산 공단 출퇴근 버스 실시간 노선 및 시간표",
    url: "https://its.ulsan.kr",
    category: "ចរាចរណ៍ / Transport"
  },
  {
    nameKm: "ដានូរី (Danuri Portal)",
    nameKr: "다누리 포털 (생활정보)",
    descKm: "ព័ត៌មានអំពីការរស់នៅក្នុងប្រទេសកូរ៉េ និងលេខទូរស័ព្ទជំនួយបន្ទាន់ (1345/1350)",
    descKr: "다국어 생활 정보 및 긴급 상담 전화 안내",
    url: "https://www.liveinkorea.kr",
    category: "ជីវិត / Life"
  }
];

export const App: React.FC = () => {
  const [isKorean, setIsKorean] = useState<boolean>(false);
  const [todayVerse, setTodayVerse] = useState<BibleVerse | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'electric' | 'korean'>('home');

  // 전기세 분배 계산기 State
  const [totalBill, setTotalBill] = useState<number>(0);
  const [rooms, setRooms] = useState<RoomBill[]>([
    { id: 1, name: 'បន្ទប់ ១ (방 1)', usage: 0, cost: 0 },
    { id: 2, name: 'បន្ទប់ ២ (방 2)', usage: 0, cost: 0 }
  ]);

  // 한국어 배우기 랜덤 7개 추출 State
  const [randomKoreanList, setRandomKoreanList] = useState<KoreanStudyItem[]>([]);

  const getRandomStudyItems = () => {
    const shuffled = [...koreanStudyDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setTodayVerse(bibleVerses[randomIndex]);

    setRandomKoreanList(getRandomStudyItems());
  }, []);

  const handleRefreshKoreanList = () => {
    setRandomKoreanList(getRandomStudyItems());
  };

  const toggleLanguage = () => {
    setIsKorean(prev => !prev);
  };

  // 전기세 계산 함수
  const calculateBillDistribution = (updatedTotalBill: number, updatedRooms: RoomBill[]) => {
    const totalUsage = updatedRooms.reduce((acc, room) => acc + (room.usage || 0), 0);

    if (updatedTotalBill <= 0 || totalUsage <= 0) {
      setRooms(updatedRooms.map(r => ({ ...r, cost: 0 })));
      return;
    }

    let calculatedRooms = updatedRooms.map(room => {
      const ratio = (room.usage || 0) / totalUsage;
      const exactCost = updatedTotalBill * ratio;
      const roundedCost = Math.round(exactCost / 100) * 100;
      return { ...room, cost: roundedCost };
    });

    const currentTotalCost = calculatedRooms.reduce((acc, r) => acc + r.cost, 0);
    const difference = updatedTotalBill - currentTotalCost;

    if (difference !== 0) {
      const activeRooms = calculatedRooms.filter(r => r.usage > 0);
      if (activeRooms.length > 0) {
        const minUsage = Math.min(...activeRooms.map(r => r.usage));
        const minRoomIndex = calculatedRooms.findIndex(r => r.usage === minUsage);

        if (minRoomIndex !== -1) {
          calculatedRooms[minRoomIndex].cost += difference;
        }
      }
    }

    setRooms(calculatedRooms);
  };

  const handleTotalBillChange = (val: number) => {
    setTotalBill(val);
    calculateBillDistribution(val, rooms);
  };

  const handleAddRoom = () => {
    const newRoom: RoomBill = {
      id: Date.now(),
      name: isKorean ? `방 ${rooms.length + 1}` : `បន្ទប់ ${rooms.length + 1}`,
      usage: 0,
      cost: 0
    };
    const updatedRooms = [...rooms, newRoom];
    calculateBillDistribution(totalBill, updatedRooms);
  };

  const handleRemoveRoom = (id: number) => {
    if (rooms.length <= 1) return;
    const updatedRooms = rooms.filter(r => r.id !== id);
    calculateBillDistribution(totalBill, updatedRooms);
  };

  const handleRoomNameChange = (id: number, name: string) => {
    const updatedRooms = rooms.map(r => r.id === id ? { ...r, name } : r);
    setRooms(updatedRooms);
  };

  const handleRoomUsageChange = (id: number, usage: number) => {
    const updatedRooms = rooms.map(r => r.id === id ? { ...r, usage } : r);
    calculateBillDistribution(totalBill, updatedRooms);
  };

  const totalUsage = rooms.reduce((acc, r) => acc + (r.usage || 0), 0);

  return (
    <div className="app-container">
      {/* 상단 내비게이션 */}
      <header className="header">
        <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <h1>무빙 캄보디아 <span>(moving Cambodia)</span></h1>
        </div>
        <button className="lang-toggle-btn" onClick={toggleLanguage}>
          {isKorean ? "🇰🇭 ភាសាខ្មែរ" : "🇰🇷 한국어 번역"}
        </button>
      </header>

      {/* 메인 서비스 메뉴 버튼 */}
      <nav className="nav-menu">
        <button 
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          {isKorean ? "🏠 홈" : "🏠 ទំព័រដើម"}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'electric' ? 'active' : ''}`}
          onClick={() => setActiveTab('electric')}
        >
          {isKorean ? "⚡ 전기세 계산" : "⚡ គណនាថ្លៃអគ្គិសនី"}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'korean' ? 'active' : ''}`}
          onClick={() => setActiveTab('korean')}
        >
          {isKorean ? "📖 한국어 배우기" : "📖 រៀនភាសាកូរ៉េ"}
        </button>
      </nav>

      {/* 탭 1: 메인 홈 화면 */}
      {activeTab === 'home' && (
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-image-wrapper">
              <img src={pic1} alt="Community 1" className="hero-img main-img" />
              <img src={pic2} alt="Community 2" className="hero-img sub-img" />
            </div>
            <div className="hero-text">
              <h2>{isKorean ? "예수님 믿으세요." : "សូមជឿលើព្រះយេស៊ូវ"}</h2>
              <h4>{isKorean ? "우리는 예수님을 믿어야 천국에 갈 수 있습니다." : "យើងត្រូវតែជឿលើព្រះយេស៊ូវ ទើបអាចទៅស្ថានសួគ៌បាន"}</h4>
              <p>
                {isKorean 
                  ? "예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라.(요 14:6)" 
                  : "ព្រះយេស៊ូវមានព្រះបន្ទូលទៅគាត់ថា៖ «យើងជាផ្លូវ ជាសេចក្តីពិត និងជាជីវិត។ គ្មាននរណាម្នាក់អាចទៅឯព្រះបិតាបានឡើយ វៀរលែងតែទៅតាមរយៈយើង» (យូហាន 14:6)"}
              </p>
            </div>
          </section>

          <section className="verse-card">
            <span className="verse-badge">{isKorean ? "오늘의 말씀" : "ខព្រះគម្ពីរថ្ងៃនេះ"}</span>
            {todayVerse && (
              <div className="verse-body">
                <p className="verse-text">"{isKorean ? todayVerse.kr : todayVerse.km}"</p>
                <p className="verse-ref">{isKorean ? todayVerse.refKr : todayVerse.refKm}</p>
              </div>
            )}
          </section>

          <section className="subway-section">
            <div className="subway-header">
              <span className="metro-badge">LINE 1: JESUS CHRIST</span>
              <h3>
                {isKorean 
                  ? "🚇 구원의 길: 복음 지하철 노선도" 
                  : "🚇 ផ្លូវនៃសេចក្តីសង្គ្រោះ: ផែនទីខ្សែរថភ្លើងក្រោមដីនៃដំណឹងល្អ"}
              </h3>
              <p className="subway-subtitle">
                {isKorean 
                  ? "창조부터 다시 오실 예수님까지 이어지는 8개의 노선 역입니다." 
                  : "ស្ថានីយចំនួន ៨ ដែលភ្ជាប់ពីការបង្កើត រហូតដល់ការយាងមកវិញនៃព្រះយេស៊ូវ"}
              </p>
            </div>

            <div className="subway-map-container">
              <div className="subway-line"></div>
              <div className="subway-stations">
                {gospelRoute.map((station) => (
                  <div key={station.id} className="subway-station-item">
                    <div className="station-node-wrapper">
                      <div className="station-node">
                        <span className="node-number">{station.id}</span>
                      </div>
                    </div>
                    <div className="station-info-card">
                      <div className="station-header">
                        <h4>{isKorean ? station.titleKr : station.titleKm}</h4>
                        <span className="station-verse">{isKorean ? station.verseKr : station.verseKm}</span>
                      </div>
                      <p className="station-desc">{isKorean ? station.descKr : station.descKm}</p>
                      <blockquote className="station-verse-text">
                        "{isKorean ? station.verseTextKr : station.verseTextKm}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="links-section">
            <div className="section-title">
              <h3>
                {isKorean 
                  ? "🔗 울산 캄보디아 노동자를 위한 필수 웹사이트 10선" 
                  : "🔗 គេហទំព័រចាំបាច់ទាំង ១០ សម្រាប់ពលករកម្ពុជានៅអ៊ុលសាន"}
              </h3>
            </div>
            <div className="links-grid">
              {usefulLinks.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="link-card">
                  <div className="link-category">{item.category}</div>
                  <h4>{isKorean ? item.nameKr : item.nameKm}</h4>
                  <p>{isKorean ? item.descKr : item.descKm}</p>
                  <div className="link-action">
                    <span>{isKorean ? "방문하기 ➔" : "ចូលមើលគេហទំព័រ ➔"}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="gallery-section">
            <div className="gallery-card">
              <img src={pic3} alt="Community 3" />
              <div className="gallery-desc">
                <h4>{isKorean ? "예배하는 사람들" : "អ្នកថ្វាយបង្គំ"}</h4>
                <p>
                  {isKorean 
                    ? "저희는 매주 일요일 오직 하나님을 예배하는 공동체입니다." 
                    : "យើងជាសហគមន៍ដែលថ្វាយបង្គំព្រះជាម្ចាស់តែមួយគត់នៅរៀងរាល់ថ្ងៃអាទិត្យ"}
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* 탭 2: 전기세 분배 계산기 페이지 */}
      {activeTab === 'electric' && (
        <main className="main-content">
          <section className="page-card">
            <h3>{isKorean ? "⚡ 방별 전기요금 계산기" : "⚡ ម៉ាស៊ីនគណនាថ្លៃអគ្គិសនีតាមបន្ទប់"}</h3>
            <p className="page-desc">
              {isKorean 
                ? "전체 요금과 방별 전기 사용량을 입력하면 쓴 만큼 요금을 나눠드립니다." 
                : "បញ្ចូលថ្លៃភ្លើងសរុប និងបរិមាណនៃការប្រើប្រាស់តាមបន្ទប់ ដើម្បីគណនាថ្លៃភ្លើងតាមការប្រើប្រាស់ជាក់ស្តែង"}
            </p>

            <div className="calc-container">
              <div className="total-bill-input-group">
                <label htmlFor="total-bill-input">
                  {isKorean ? "총 전기 요금 (원):" : "ថ្លៃអគ្គិសនីសរុប (វ៉ុន):"}
                </label>
                <input 
                  id="total-bill-input"
                  type="number" 
                  placeholder={isKorean ? "예: 150000" : "ឧទាហរណ៍: 150000"} 
                  value={totalBill || ''} 
                  onChange={(e) => handleTotalBillChange(Number(e.target.value))}
                />
              </div>

              <div className="room-list">
                <div className="room-list-header">
                  <span>{isKorean ? "방 목록" : "បញ្ជីបន្ទប់"}</span>
                  <button className="add-room-btn" onClick={handleAddRoom}>
                    {isKorean ? "+ 방 추가" : "+ បន្ថែមបន្ទប់"}
                  </button>
                </div>

                {rooms.map((room) => (
                  <div key={room.id} className="room-item">
                    <input 
                      type="text" 
                      className="room-name-input"
                      value={room.name}
                      onChange={(e) => handleRoomNameChange(room.id, e.target.value)}
                      placeholder={isKorean ? "방 이름" : "ឈ្មោះបន្ទប់"}
                    />
                    <div className="usage-input-wrapper">
                      <input 
                        type="number" 
                        className="room-usage-input"
                        value={room.usage || ''}
                        onChange={(e) => handleRoomUsageChange(room.id, Number(e.target.value))}
                        placeholder={isKorean ? "사용량 (kWh)" : "ប្រទះប្រើប្រាស់ (kWh)"}
                      />
                      <span className="unit-text">kWh</span>
                    </div>

                    <div className="room-cost-display">
                      <span className="cost-amount">{room.cost.toLocaleString()}</span>
                      <span className="cost-unit">{isKorean ? "원" : "វ៉ុន"}</span>
                    </div>

                    {rooms.length > 1 && (
                      <button 
                        className="delete-room-btn" 
                        onClick={() => handleRemoveRoom(room.id)}
                        title={isKorean ? "삭제" : "លុប"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="calc-summary">
                <div className="summary-row">
                  <span>{isKorean ? "총 사용량:" : "ការប្រើប្រាស់សរុប:"}</span>
                  <strong>{totalUsage.toLocaleString()} kWh</strong>
                </div>
                <div className="summary-row highlight">
                  <span>{isKorean ? "계산된 요금 합계:" : "ថ្លៃសរុបដែលបានគណនា:"}</span>
                  <strong>{rooms.reduce((acc, r) => acc + r.cost, 0).toLocaleString()} {isKorean ? "원" : "វ៉ុន"}</strong>
                </div>
                {totalBill > 0 && totalBill !== rooms.reduce((acc, r) => acc + r.cost, 0) && (
                  <p className="notice-text">
                    {isKorean 
                      ? "* 10원 단위 잔돈은 사용량이 가장 적은 방 요금에 포함되었습니다." 
                      : "* អត្ថបទកែតម្រូវចុងក្រោយត្រូវបានបូកបញ្ចូលក្នុងបន្ទប់ដែលប្រើប្រាស់តិចជាងគេ"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* 탭 3: 한국어 공부 페이지 */}
      {activeTab === 'korean' && (
        <main className="main-content">
          <section className="page-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>{isKorean ? "📖 한국어 학습 (7개 추천)" : "📖 រៀនភាសាកូរ៉េ (៧ ប្រយោគ)"}</h3>
              <button className="add-room-btn" onClick={handleRefreshKoreanList}>
                {isKorean ? "🔄 새로고침" : "🔄 ផ្លាស់ប្តូរថ្មី"}
              </button>
            </div>
            <p className="page-desc">
              {isKorean 
                ? "40개의 한국어 표현 중에서 랜덤으로 추천된 7개의 단어/문장입니다." 
                : "ពាក្យ និងប្រយោគភាសាកូរ៉េចំនួន ៧ ដែលត្រូវបានជ្រើសរើសដោយចៃដន្យចេញពី ៤០ ពាក្យ"}
            </p>
            
            <div className="korean-grid">
              {randomKoreanList.map((item, idx) => (
                <div key={item.id} className="study-card">
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '4px' }}>
                    #{idx + 1}
                  </div>
                  <h4>{item.kr}</h4>
                  <p className="pron-text">발음 (การอ่าน): {item.kmPron}</p>
                  <p className="meaning-text">অর্থ (សេចក្តីន័យ): {item.kmMeaning}</p>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>({item.enMeaning})</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* 푸터 */}
      <footer className="footer">
        <p>© 2026 moving Cambodia (무빙 캄보디아) Christian Community in Ulsan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;