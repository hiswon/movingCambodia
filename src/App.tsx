import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
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
  { id: 1, kr: "안녕하세요", kmPron: "អាន-ន្យ៉ុង-ហា-សេ-យ៉ូ", kmMeaning: "ជម្រាបសួរ", enMeaning: "Hello" },
  { id: 2, kr: "감사합니다", kmPron: "ខាំ-សា-ហាំ-នី-ដា", kmMeaning: "អរគុណ", enMeaning: "Thank you" },
  { id: 3, kr: "죄송합니다", kmPron: "ឆ្វេ-សុង-ហាំ-នី-ដា", kmMeaning: "សុំទោស", enMeaning: "Sorry" },
  { id: 4, kr: "예수님", kmPron: "យេ-ស៊ូ-នីម", kmMeaning: "ព្រះយេស៊ូវ", enMeaning: "Jesus" },
  { id: 5, kr: "사랑", kmPron: "សា-រ៉ាំង", kmMeaning: "សេចក្តីស្រឡាញ់", enMeaning: "Love" },
  { id: 6, kr: "은혜", kmPron: "អ៊ុន-ហេ", kmMeaning: "ព្រះគុណ", enMeaning: "Grace" },
  { id: 7, kr: "축복합니다", kmPron: "ឈុក-បុក-ហាំ-នី-ដា", kmMeaning: "សូមព្រះប្រទានពរ", enMeaning: "God bless you" },
  { id: 8, kr: "기도", kmPron: "ឃី-ដូ", kmMeaning: "ការអធិស្ឋាន", enMeaning: "Prayer" },
  { id: 9, kr: "믿음", kmPron: "មី-ឌឹម", kmMeaning: "ជំនឿ", enMeaning: "Faith" },
  { id: 10, kr: "소망", kmPron: "សូ-ម៉ាំង", kmMeaning: "សេចក្តីសង្ឃឹម", enMeaning: "Hope" },
  { id: 11, kr: "얼마예요?", kmPron: "អល់-ម៉ា-យេ-យ៉ូ?", kmMeaning: "ថ្លៃប៉ុន្មាន?", enMeaning: "How much is it?" },
  { id: 12, kr: "어디예요?", kmPron: "អូ-ឌី-យេ-យ៉ូ?", kmMeaning: "នៅឯណា?", enMeaning: "Where is it?" },
  { id: 13, kr: "도와주세요", kmPron: "ថូ-វ៉ា-ជូ-សេ-យ៉ូ", kmMeaning: "សូមជួយខ្ញុំផង", enMeaning: "Please help me" },
  { id: 14, kr: "네 / 아니요", kmPron: "នេ / អា-នី-យ៉ូ", kmMeaning: "បាទ/ចាស / ទេ", enMeaning: "Yes / No" },
  { id: 15, kr: "괜찮아요", kmPron: "ខ្វែន-ឆា-ណា-យ៉ូ", kmMeaning: "មិនអីទេ", enMeaning: "It's okay" },
  { id: 16, kr: "전기세", kmPron: "ឆន-ឃី-សេ", kmMeaning: "ថ្លៃអគ្គិសនី", enMeaning: "Electricity bill" },
  { id: 17, kr: "월세", kmPron: "វ៉ុល-សេ", kmMeaning: "ថ្លៃឈ្នួលផ្ទះប្រចាំខែ", enMeaning: "Monthly rent" },
  { id: 18, kr: "수도세", kmPron: "ស៊ូ-ដូ-សេ", kmMeaning: "ថ្លៃទឹក", enMeaning: "Water bill" },
  { id: 19, kr: "영수증", kmPron: "យ៉ុង-ស៊ូ-ជឹង", kmMeaning: "វិក្កយបត្រ", enMeaning: "Receipt" },
  { id: 20, kr: "계좌번호", kmPron: "គ្យេ-ឆ្វា-ប៊ន-ហូ", kmMeaning: "លេខគណនី", enMeaning: "Account number" },
  { id: 21, kr: "밥 먹었어요?", kmPron: "ផាប់ ម៊ុក-អូស-ស៊ូ-យ៉ូ?", kmMeaning: "ញ៉ាំបាយហើយឬនៅ?", enMeaning: "Have you eaten?" },
  { id: 22, kr: "맛있어요", kmPron: "ម៉ា-ស៊ី-ស៊ូ-យ៉ូ", kmMeaning: "ឆ្ងាញ់ណាស់", enMeaning: "It's delicious" },
  { id: 23, kr: "어디 가요?", kmPron: "អូ-ឌី គា-យ៉ូ?", kmMeaning: "ទៅណា?", enMeaning: "Where are you going?" },
  { id: 24, kr: "집에 가요", kmPron: "ឈីប-បេ គា-យ៉ូ", kmMeaning: "ទៅផ្ទះ", enMeaning: "Going home" },
  { id: 25, kr: "오늘", kmPron: "អូ-នើល", kmMeaning: "ថ្ងៃនេះ", enMeaning: "Today" },
  { id: 26, kr: "내일", kmPron: "នែ-អិល", kmMeaning: "ថ្ងៃស្អែក", enMeaning: "Tomorrow" },
  { id: 27, kr: "주일 (일요일)", kmPron: "ជូ-អិល (អិល-យូ-អិល)", kmMeaning: "ថ្ងៃអាទិត្យ", enMeaning: "Sunday" },
  { id: 28, kr: "교회", kmPron: "គ្យូ-ហ្វេ", kmMeaning: "ព្រះវិហារ", enMeaning: "Church" },
  { id: 29, kr: "성경", kmPron: "សុង-គ្យុង", kmMeaning: "ព្រះគម្ពីរ", enMeaning: "Bible" },
  { id: 30, kr: "찬양", kmPron: "ឆាន់-យ៉ាង", kmMeaning: "ការសរសើរតម្កើង", enMeaning: "Praise" },
  { id: 31, kr: "평안하세요", kmPron: "ភ្យុង-អាន់-ហា-សេ-យ៉ូ", kmMeaning: "សូមឱ្យមានសន្តិភាព", enMeaning: "Peace be with you" },
  { id: 32, kr: "수고하셨습니다", kmPron: "ស៊ូ-ហ្គូ-ហា-ស៊ីយ៉ុស-សឹម-នី-ដា", kmMeaning: "អរគុណសម្រាប់ការខិតខំប្រឹងប្រែង", enMeaning: "Good job / Thank you" },
  { id: 33, kr: "천국", kmPron: "ឆន-ហ្គុក", kmMeaning: "ស្ថានសួគ៌", enMeaning: "Heaven" },
  { id: 34, kr: "구원", kmPron: "គូ-វ៉ុន", kmMeaning: "ការសង្គ្រោះ", enMeaning: "Salvation" },
  { id: 35, kr: "친구", kmPron: "ឈិន-ហ្គូ", kmMeaning: "មិត្តភក្តិ", enMeaning: "Friend" },
  { id: 36, kr: "병원", kmPron: "ព្យុង-វ៉ុន", kmMeaning: "មន្ទីរពេទ្យ", enMeaning: "Hospital" },
  { id: 37, kr: "약국", kmPron: "យ៉ាង-ហ្គុក", kmMeaning: "ឱសថស្ថាន", enMeaning: "Pharmacy" },
  { id: 38, kr: "아파요", kmPron: "អា-ផា-យ៉ូ", kmMeaning: "ឈឺ", enMeaning: "It hurts / Sick" },
  { id: 39, kr: "피곤해요", kmPron: "ភី-កូន-ហែ-យ៉ូ", kmMeaning: "ហត់ណាស់", enMeaning: "Tired" },
  { id: 40, kr: "행복하세요", kmPron: "ហែង-បុក-ហា-សេ-យ៉ូ", kmMeaning: "សូមឱ្យមានសេចក្តីសុខ", enMeaning: "Be happy" }
];

// 복음 지하철 노선도 (KSV 성경 기준 캄보디아어)
const gospelRoute: GospelStation[] = [
  {
    id: 1,
    titleKm: "1. การสร้าง (ការបង្កើត)",
    titleKr: "1. 창조",
    descKm: "ព្រះជាម្ចាស់បានបង្កើតសកលលោក មនុស្សលោក និងអ្វីៗទាំងអស់យ៉ាងល្អប្រពៃ។",
    descKr: "하나님께서 세상과 인간을 아름답게 창조하셨습니다.",
    verseKm: "លោកុប្បត្តិ 1:1",
    verseKr: "창 1:1",
    verseTextKm: "នៅដើមដំបូង ព្រះជាម្ចាស់បានបង្កើតផ្ទៃមេឃ និងផែនដី។",
    verseTextKr: "태초에 하나님이 천지를 창조하시니라"
  },
  {
    id: 2,
    titleKm: "2. อំពើบាប (អំពើបាប)",
    titleKr: "2. 죄",
    descKm: "មនុស្សបានបោះបង់ចោលព្រះជាម្ចាស់ ហើយធ្លាក់ចូលទៅក្នុងអំពើបាប។",
    descKr: "인간이 하나님을 떠나 죄에 빠졌습니다.",
    verseKm: "រ៉ូម 3:23",
    verseKr: "롬 3:23",
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
    verseKr: "롬 6:23",
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
    verseKr: "요 3:16",
    verseTextKm: "ដ្បិតព្រះជាម្ចាស់ស្រឡាញ់មនុស្សលោកខ្លាំងណាស់ រហូតដល់បានប្រទានព្រះរាជបុត្រាតែមួយគត់របស់ព្រះអង្គ ដើម្បីឱ្យអ្នកណាដែលជឿលើព្រះរាជបុត្រានោះ មិនត្រូវវិនាសឡើយ ប៉ុន្តែមានជីវិតអស់កល្បជានិច្ច។",
    verseTextKr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"
  },
  {
    id: 5,
    titleKm: "5. การสุគតជំនួសយើង",
    titleKr: "5. 대신 죽으심",
    descKm: "ព្រះយេស៊ូវបានទទួលរងទោសបាប និងសុគតនៅលើឈើឆ្កាងជំនួសយើង។",
    descKr: "예수님이 우리 죄를 위해 십자가에서 대신 죽으셨습니다.",
    verseKm: "រ៉ូម 5:8",
    verseKr: "롬 5:8",
    verseTextKm: "ប៉ុន្តែ ព្រះជាម្ចាស់បានបង្ហាញសេចក្ដីស្រឡាញ់របស់ព្រះអង្គចំពោះយើង គឺនៅពេលដែលយើងនៅជាអ្នកធ្វើបាបនៅឡើយ ព្រះគ្រីស្ទបានសុគតជួសយើង។",
    verseTextKr: "우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라"
  },
  {
    id: 6,
    titleKm: "6. การសង្គ្រោះ",
    titleKr: "6. 구원",
    descKm: "យើងទទួលបានการអត់ទោសបាប និងទទួលបានជីវិតអស់កល្បជានិច្ចជាអំណោយទាន។",
    descKr: "죄 사함을 받고 영원한 생명을 선물로 받습니다.",
    verseKm: "អេភេសូរ 2:8",
    verseKr: "엡 2:8",
    verseTextKm: "ដ្បិតគឺដោយសារព្រះគុណហើយ ដែលអ្នករាល់គ្នាត្រូវបានសង្គ្រោះតាមរយៈជំនឿ ហើយនេះមិនមែនកើតចេញពីអ្នករាល់គ្នាឡើយ គឺជារង្វាន់របស់ព្រះជាម្ចាស់។",
    verseTextKr: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라"
  },
  {
    id: 7,
    titleKm: "7. ជំនឿ",
    titleKr: "7. 믿음",
    descKm: "យើងទទួលបានการសង្គ្រោះដោយសារการជឿ និងទទួលស្វាគមន៍ព្រះយេស៊ូវនៅក្នុងចិត្ត។",
    descKr: "예수님을 마음으로 믿고 영접함으로 구원에 이릅니다.",
    verseKm: "រ៉ូម 10:10",
    verseKr: "롬 10:10",
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
    verseKr: "계 22:20",
    verseTextKm: "ព្រះអង្គដែលធ្វើបន្ទាល់អំពីการទាំងនេះ មានព្រះបន្ទូលថា៖ «មែនហើយ យើងនឹងមកយ៉ាងឆាប់!»។ អាម៉ែន! ព្រះអម្ចាស់យេស៊ូវអើយ សូមយាងមក!",
    verseTextKr: "이것들을 증언하신 이가 이르시되 내가 진실로 속히 오리라 하시거늘 아멘 주 예수여 오시옵소서"
  }
];

const bibleVerses: BibleVerse[] = [
  { km: "ដ្បិតព្រះជាម្ចាស់ស្រឡាញ់មនុស្សលោកខ្លាំងណាស់ រហូតដល់បានប្រទានព្រះរាជបុត្រាតែមួយគត់របស់ព្រះអង្គ ដើម្បីឱ្យអ្នកណាដែលជឿលើព្រះអង្គ មិនត្រូវវិនាសឡើយ ប៉ុន្តែមានជីវិតអស់កល្បជានិច្ច", kr: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라", refKm: "(យូហាន 3:16)", refKr: "(요 3:16)" },
  { km: "ព្រះយេហូវ៉ាទ្រង់ជាអ្នកគង្វាលខ្ញុំ ខ្ញុំគ្មានខ្វះអ្វីឡើយ", kr: "여호와는 나의 목자시니 내게 부족함이 없으리로다", refKm: "(ទំនុកតម្កើង 23:1)", refKr: "(시 23:1)" },
  { km: "អស់អ្នកដែលនឿយហត់ និងរែកបន្ទុកធ្ងន់អើយ ចូរមកឯខ្ញុំ ខ្ញុំនឹងឱ្យអ្នករាល់គ្នាបានសម្រាក", kr: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", refKm: "(ម៉ាថាយ 11:28)", refKr: "(마 11:28)" },
  { km: "ចូរទុកចិត្តលើព្រះយេហូវ៉ាឱ្យអស់ពីចិត្ត ហើយកុំពឹងផ្អែកលើការយល់ដឹងរបស់ខ្លួនឡើយ", kr: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라", refKm: "(សុភាសិត 3:5)", refKr: "(잠 3:5)" },
  { km: "ចូរទទួលស្គាល់ទ្រង់នៅក្នុងគ្រប់ផ្លូវរបស់អ្នក ហើយទ្រង់នឹងតម្រង់ផ្លូវរបស់អ្នក", kr: "너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라", refKm: "(សុភាសិត 3:6)", refKr: "(잠 3:6)" },
  { km: "កុំខ្លាចឡើយ ដ្បិតយើងនៅជាមួយអ្នក កុំតក់ស្លុតឡើយ ដ្បិតយើងជាព្រះរបស់អ្នក យើងនឹងពង្រឹងអ្នក ហើយជួយអ្នកដោយពិតប្រាកដ", kr: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라", refKm: "(អេសាយ 41:10)", refKr: "(사 41:10)" },
  { km: "ខ្ញុំអាចធ្វើអ្វីៗទាំងអស់បាន ដោយសារព្រះអង្គដែលប្រទានកម្លាំងដល់ខ្ញុំ", kr: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", refKm: "(ភីលីព 4:13)", refKr: "(빌 4:13)" },
  { km: "ហើយព្រះនៃខ្ញុំ នឹងបំពេញគ្រប់សេចក្តីត្រូវការរបស់អ្នករាល់គ្នា តាមសិរីល្អដ៏ស្តុកស្តម្ភរបស់ព្រះអង្គនៅក្នុងព្រះគ្រីស្ទយេស៊ូវ", kr: "나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라", refKm: "(ភីលីព 4:19)", refKr: "(빌 4:19)" },
  { km: "កុំខ្វល់ខ្វាយអំពីអ្វីឡើយ ប៉ុន្តែនៅក្នុងគ្រប់កិច្ចការទាំងអស់ ចូរជម្រាបសេចក្តីត្រូវការរបស់អ្នកទៅព្រះជាម្ចាស់តាមរយៈការអធិស្ឋាន និងការទូលសូម ព្រមទាំងការអរព្រះគុណ", kr: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", refKm: "(ភីលីព 4:6)", refKr: "(빌 4:6)" },
  { km: "ហើយសន្តិសុខរបស់ព្រះជាម្ចាស់ ដែលហួសពីការយល់ដឹងទាំងឡាយ នឹងការពារចិត្ត និងគំនិតរបស់អ្នករាល់គ្នានៅក្នុងព្រះគ្រីស្ទយេស៊ូវ", kr: "그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", refKm: "(ភីលីព 4:7)", refKr: "(빌 4:7)" },

  // 11 ~ 20
  { km: "ព្រះបន្ទូលរបស់ព្រះអង្គជាចង្កៀងសម្រាប់ជើងខ្ញុំ ហើយជាពន្លឺសម្រាប់ផ្លូវខ្ញុំ", kr: "주의 말씀은 내 발에 등요 내 길에 빛이니이다", refKm: "(ទំនុកតម្កើង 119:105)", refKr: "(시 119:105)" },
  { km: "ចូរស្វែងរកព្រះរាជ្យរបស់ព្រះជាម្ចាស់ និងសេចក្តីសុចរិតរបស់ព្រះអង្គជាមុនសិន ហើយអ្វីៗទាំងនេះនឹងត្រូវបានប្រទានមកអ្នកបន្ថែមទៀត", kr: "그런즉 너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라", refKm: "(ម៉ាថាយ 6:33)", refKr: "(마 6:33)" },
  { km: "ត្បិតយើងស្គាល់គំនិតដែលយើងមានចំពោះអ្នករាល់គ្នា គឺជាគំនិតសន្តិភាព មិនមែនដើម្បីសេចក្តីវិនាសឡើយ ដើម្បីឱ្យអ្នកមានសេចក្តីសង្ឃឹម និងអនាគតដ៏ល្អ", kr: "여호와의 말씀이니라 너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라", refKm: "(យេរេមា 29:11)", refKr: "(렘 29:11)" },
  { km: "ចូរអរព្រះគុណក្នុងគ្រប់កាលៈទេសៈទាំងអស់ ដ្បិតនេះជាព្រះហឫទ័យរបស់ព្រះជាម្ចាស់ចំពោះអ្នករាល់គ្នានៅក្នុងព្រះគ្រីស្ទយេស៊ូវ", kr: "범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", refKm: "(1 ថែស្សាឡូនិច 5:18)", refKr: "(살전 5:18)" },
  
  { km: "ដូច្នេះ ប្រសិនបើអ្នកណាម្នាក់នៅក្នុងព្រះគ្រីស្ទ អ្នកនោះជាការបង្កើតថ្មី អ្វីៗដែលចាស់បានកន្លងផុតទៅ ហើយមើលចុះ អ្វីៗទាំងអស់បានក្លាយជាថ្មី", kr: "그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다", refKm: "(2 កូរិនថូស 5:17)", refKr: "(고후 5:17)" },
  { km: "ព្រះជាម្ចាស់ជាទីពឹង និងជាកម្លាំងរបស់យើង ជាជំនួយដែលតែងតែមាននៅក្នុងគ្រាលំបាក", kr: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라", refKm: "(ទំនុកតម្កើង 46:1)", refKr: "(시 46:1)" },
  { km: "ចូរសុំ នោះនឹងប្រទានឱ្យអ្នក ចូរស្វែងរក នោះនឹងបានជួប ចូរគោះទ្វារ នោះនឹងបានបើកឱ្យអ្នក", kr: "구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니", refKm: "(ម៉ាថាយ 7:7)", refKr: "(마 7:7)" },

  // 21 ~ 30
  { km: "សេចក្តីស្រឡាញ់តែងតែអត់ធ្មត់ សេចក្តីស្រឡាញ់តែងតែមានចិត្តសប្បុរស", kr: "사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며", refKm: "(1 កូរិនថូស 13:4)", refKr: "(고전 13:4)" },
  { km: "ដូច្នេះ ជំនឿ សេចក្តីសង្ឃឹម និងសេចក្តីស្រឡាញ់ ទាំងបីនេះនៅស្ថិតស្ថេរ ប៉ុន្តែសេចក្តីស្រឡាញ់ជាសេចក្តីដ៏អស្ចារ្យបំផុត", kr: "그런즉 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라", refKm: "(1 កូរិនថូស 13:13)", refKr: "(고전 13:13)" },
  { km: "ព្រះយេស៊ូវមានព្រះបន្ទូលទៅគាត់ថា៖ យើងជាផ្លូវ ជាសេចក្តីពិត និងជាជីវិត គ្មានអ្នកណាមកឯព្រះបិតាបានឡើយ វៀរលែងតែតាមរយៈយើង", kr: "예수께서 이르시되 내가 곧 길요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라", refKm: "(យូហាន 14:6)", refKr: "(요 14:6)" },
  { km: "ខ្ញុំបានត្រូវឆ្កាងជាមួយព្រះគ្រីស្ទហើយ ដូច្នេះ មិនមែនជាខ្ញុំទៀតទេដែលរស់នៅ គឺព្រះគ្រីស្ទដែលគង់នៅក្នុងខ្ញុំ", kr: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라", refKm: "(កាឡាទី 2:20)", refKr: "(갈 2:20)" },
  { km: "ប្រគល់ផ្លូវរបស់អ្នកទៅព្រះយេហូវ៉ា ចូរទុកចិត្តលើទ្រង់ នោះទ្រង់នឹងសម្រេចឱ្យ", kr: "네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고", refKm: "(ទំនុកតម្កើង 37:5)", refKr: "(시 37:5)" },
  { km: "ចូរស្ងប់ស្ងាត់ ហើយដឹងថា យើងជាព្រះជាម្ចាស់", kr: "이르시기를 너희는 가만히 있어 내가 하나님 됨을 알찌어다", refKm: "(ទំនុកតម្កើង 46:10)", refKr: "(시 46:10)" },
  { km: "ប៉ុន្តែ អស់អ្នកដែលរង់ចាំព្រះយេហូវ៉ា នឹងបានកម្លាំងឡើងវិញ ពួកគេនឹងហោះឡើងដោយស្លាបដូចសត្វឥន្ទ្រី", kr: "오직 여호와를 갈망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요", refKm: "(អេសាយ 40:31)", refKr: "(사 40:31)" },
  { km: "ចូរមានចិត្តក្លាហាន និងរឹងប៉ឹងចុះ កុំខ្លាច ហើយកុំតក់ស្លុតឡើយ ដ្បិតព្រះយេហូវ៉ាជាព្រះរបស់អ្នក ទ្រង់យាងទៅជាមួយអ្នក", kr: "강하고 담대하라 두려워하지 말라 그들 앞에서 떨지 말라 이는 네 하나님 여호와 그가 너와 함께 가시며", refKm: "(ចោទិយកថា 31:6)", refKr: "(신 31:6)" },
  { km: "សន្តិភាពដែលយើងទុកឱ្យអ្នករាល់គ្នា គឺជាសន្តិភាពរបស់យើងផ្ទាល់ដែលប្រទានឱ្យអ្នក ចិត្តរបស់អ្នករាល់គ្នាកុំតក់ស្លុត ឬខ្លាចឡើយ", kr: "평안을 너희에게 미치노니 곧 나의 평안을 너희에게 주노라 너희는 마음에 근심하지도 말고 두려워하지도 말라", refKm: "(យូហាន 14:27)", refKr: "(요 14:27)" },
  { km: "ដ្បិតដោយសារព្រះគុណហើយ ដែលអ្នករាល់គ្នាបានសង្គ្រោះតាមរយៈជំនឿ ហើយនេះមិនមែនមកពីខ្លួនអ្នករាល់គ្នាឡើយ គឺជារង្វាន់ពីព្រះជាម្ចាស់", kr: "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라", refKm: "(អេភេសូរ 2:8)", refKr: "(엡 2:8)" },

  // 31 ~ 40
  { km: "ព្រះជាម្ចាស់បានប្រទានវិញ្ញាណមកយើង មិនមែនជាវិញ្ញាណនៃសេចក្តីខ្លាចឡើយ ប៉ុន្តែជាវិញ្ញាណនៃចេស្ដា សេចក្តីស្រឡាញ់ និងការត្រួតត្រាចិត្ត", kr: "하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니", refKm: "(2 ធីម៉ូថេ 1:7)", refKr: "(딤후 1:7)" },
  { km: "ចូរប្រគល់ការខ្វល់ខ្វាយទាំងឡាយរបស់អ្នកទៅទ្រង់ ដ្បិតទ្រង់យកព្រះទ័យទុកដាក់ចំពោះអ្នក", kr: "너희 염려를 다 주께 맡기라 이는 그가 너희를 돌보심이라", refKm: "(1 ពេត្រុស 5:7)", refKr: "(벧전 5:7)" },
  { km: "គ្រប់បទគម្ពីរទាំងអស់សុទ្ធតែចេញមកពីព្រះវិញ្ញាណនៃព្រះជាម្ចាស់ ហើយមានប្រយោជន៍សម្រាប់ការបង្រៀន การរលឹកទោស ការកែតម្រង់ និងការអប់រំក្នុងសេចក្តីសុចរិត", kr: "모든 성경은 하나님의 감동으로 된 것으로 교훈과 책망과 바르게 함과 의로 교육하기에 유익하니", refKm: "(2 ធីម៉ូថេ 3:16)", refKr: "(딤후 3:16)" },
  { km: "ចូរចូលទៅជិតព្រះជាម្ចាស់ នោះទ្រង់នឹងចូលមកជិតអ្នករាល់គ្នាដែរ", kr: "하나님을 가까이하라 그리하면 너희를 가까이하시리라", refKm: "(យ៉ាកុប 4:8)", refKr: "(약 4:8)" },
  { km: "សេចក្តីជំនឿ គឺជាការប្រាកដនៃអ្វីដែលយើងសង្ឃឹមទុក និងជាភស្តុតាងនៃអ្វីដែលយើងមើលមិនឃើញ", kr: "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니", refKm: "(ហេព្រើរ 11:1)", refKr: "(히 11:1)" },
  { km: "ចូរលើកទឹកចិត្តគ្នាទៅវិញទៅមក ហើយស្ថាបនាគ្នាទៅវិញទៅមក", kr: "그러므로 피차 권면하고 서로 덕을 세우기를 너희가 하는 것 같이 하라", refKm: "(1 ថែស្សាឡូនិច 5:11)", refKr: "(살전 5:11)" },
  { km: "ចូរមានចិត្តសប្បុរស និងមានចិត្តអាណិតអាសូរដល់គ្នាទៅវិញទៅមក ហើយអត់ទោសឱ្យគ្នាទៅវិញទៅមក ដូចជាព្រះជាម្ចាស់បានអត់ទោសឱ្យអ្នករាល់គ្នានៅក្នុងព្រះគ្រីស្ទដែរ", kr: "서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라", refKm: "(អេភេសូរ 4:32)", refKr: "(엡 4:32)" },
  { km: "ព្រះយេហូវ៉ាជាពន្លឺ និងជាការសង្គ្រោះរបស់ខ្ញុំ តើខ្ញុំត្រូវខ្លាចអ្នកណា?", kr: "여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요", refKm: "(ទំនុកតម្កើង 27:1)", refKr: "(시 27:1)" },
  { km: "ចូរភ្លក់មើល ហើយឃើញថាព្រះយេហូវ៉ាល្អប្រសើរយ៉ាងណា មនុស្សដែលជឿជាក់លើទ្រង់ មានពរហើយ", kr: "너희는 여호와의 선하심을 맛보아 알지어다 그에게 피하는 자는 복이 있도다", refKm: "(ទំនុកតម្កើង 34:8)", refKr: "(시 34:8)" },
  { km: "មើលចុះ ខ្ញុំឈរនៅ দরទ្វារ ហើយគោះ ប្រសិនបើអ្នកណាម្នាក់ឮសំឡេងខ្ញុំ ហើយបើកទ្វារ ខ្ញុំនឹងចូលទៅឯអ្នកនោះ", kr: "볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어 가", refKm: "(វចនានុក្រម 3:20)", refKr: "(계 3:20)" }
];

// 울산 캄보디아 노동자를 위한 필수 웹사이트 10선
const usefulLinks: UsefulLink[] = [
  {
    nameKm: "ប្រព័ន្ធ HiKorea (ហៃកូរ៉េ)",
    nameKr: "하이코리아 (출입국 민원)",
    descKm: "កក់การណាត់ជួប កាតស្នាក់នៅ និងពន្យារប័ណ្ណទិដ្ឋាการ/ផ្លាស់ប្តូរអាសយដ្ឋាន",
    descKr: "비자 연장, 주소지 변경, 출입국 방문 예약",
    url: "https://www.hikorea.go.kr",
    category: "ទិដ្ឋាการ / Visa"
  },
  {
    nameKm: "ប្រព័ន្ធ EPS (การងារ)",
    nameKr: "EPS 외국인고용",
    descKm: "ពិនិត្យមើលកិច្ចសន្យาการងារ សិទ្ធិ និងการផ្លាស់ប្តូរកន្លែងធ្វើการ",
    descKr: "근로계약서, 체류기간 및 이직 내역 조회",
    url: "https://www.eps.go.kr",
    category: "ពលកម្ម / Labour"
  },
  {
    nameKm: "មជ្ឈមណ្ឌលគាំទ្រពលករបរទេសអ៊ុលសាន",
    nameKr: "울산외국인주민지원센터",
    descKm: "การប្រឹក្សាផ្នែកច្បាប់ដោយឥតគិតថ្លៃ និងการបកប្រែភាសាខ្មែរនៅអ៊ុលសាន",
    descKr: "울산 지역 무료 법률·노무 상담 및 한국어 교육",
    url: "http://usfr.or.kr",
    category: "អ៊ុលសាន / Ulsan"
  },
  {
    nameKm: "ស្ថានទូតកម្ពុជាប្រចាំសាធារណរដ្ឋកូរ៉េ (Seoul)",
    nameKr: "주한 캄보디아 대사관",
    descKm: "សេវាលិខិតឆ្លងដែន (Passport) និងកិច្ចการកុងស៊ុលកម្ពុជា",
    descKr: "캄보디아 여권 재발급, 영사 및 행정 서비스",
    url: "https://camembkor.mfaic.gov.kh/",
    category: "ស្ថានទូត / Embassy"
  },
  {
    nameKm: "បេឡាជាតិសន្តិសុខសង្គម/ធានារ៉ាប់រងសុខភាព (NHIS)",
    nameKr: "국민건강보험공단",
    descKm: "ពិនិត្យមើលសិទ្ធិទទួលបានการថែទាំសុខភាព និងการបង់ប្រាក់ភាគទាន",
    descKr: "외국인 건강보험 자격, 보험료 및 병원 안내",
    url: "https://www.nhis.or.kr",
    category: "សុខភាព / Medical"
  },
  {
    nameKm: "អង្គភាពសំណងគ្រោះថ្នាក់การងារ (KCOMWEL)",
    nameKr: "근로복지공단 (산재보험)",
    descKm: "การដាក់ពាក្យសុំសំណងនៅពេលមានជំងឺ ឬរបួសដោយសារการងារ",
    descKr: "산업재해(산재) 신청 및 미지급 임금 대지급금",
    url: "https://www.comwel.or.kr",
    category: "សិទ្ធិ / Welfare"
  },
  {
    nameKm: "អង្គភាពអភិវឌ្ឍន៍ធនធានមនុស្សកូរ៉េ (HRD Korea)",
    nameKr: "한국산업인력공단 (EPS)",
    descKm: "การទាមទារប្រាក់ធានារ៉ាប់រងត្រឡប់ទៅប្រទេសវិញ និងប្រាក់បំពេញการងារ",
    descKr: "귀국비용보험, 출국만기보험 신청 및 수령 안내",
    url: "https://www.hrdkorea.or.kr",
    category: "ធានារ៉ាប់រង / Insurance"
  },
  {
    nameKm: "គេហទំព័រសស្វែងរកการងារ Work24 (고용24)",
    nameKr: "고용24 (구 워크넷)",
    descKm: "ស្វែងរកการងារធ្វើដោយស្របច្បាប់ និងទទួលបានអត្ថប្រយោជន៍ផ្សេងៗ",
    descKr: "공식 구직 및 채용 정보, 고용보험 서비스",
    url: "https://www.work24.go.kr",
    category: "การងារ / Jobs"
  },
  {
    nameKm: "មជ្ឈមណ្ឌលចរាចរណ៍អ៊ុលសាន (រថយន្តក្រុង)",
    nameKr: "울산교통관리센터 (버스정보)",
    descKm: "ពិនិត្យមើលម៉ោងរថយន្តក្រុងនៅអ៊ុលសានសម្រាប់ការធ្វើដំណើរទៅធ្វើการ",
    descKr: "울산 공단 출퇴근 버스 실시간 노선 및 시간표",
    url: "https://its.ulsan.kr",
    category: "ចរាចរណ៍ / Transport"
  },
  {
    nameKm: "ដានូរី (Danuri Portal)",
    nameKr: "다누리 포털 (생활정보)",
    descKm: "ព័ត៌មានអំពីการរស់នៅក្នុងប្រទេសកូរ៉េ និងលេខទូរស័ព្ទជំនួយបន្ទាន់ (1345/1350)",
    descKr: "다국어 생활 정보 및 긴급 상담 전화 안내",
    url: "https://www.liveinkorea.kr",
    category: "ជីវិត / Life"
  }
];

export const App: React.FC = () => {
  const [isKorean, setIsKorean] = useState<boolean>(false);
  const [todayVerse, setTodayVerse] = useState<BibleVerse | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'electric' | 'korean'>('home');

  const siteUrl = "https://movingcambodia.vercel.app/";

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
      {/* 상단 내비게이션 및 미니 QR 코드 */}
      <header className="header">
        <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <h1>무빙 캄보디아 <span>(moving Cambodia)</span></h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-qr">
            <QRCode value={siteUrl} size={42} />
          </div>
          <button className="lang-toggle-btn" onClick={toggleLanguage}>
            {isKorean ? "🇰🇭 ភាសាខ្មែរ" : "🇰🇷 한국어 번역"}
          </button>
        </div>
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
                  : "ស្ថានីយចំនួន ៨ ដែលភ្ជាប់ពីการបង្កើត រហូតដល់การយាងមកវិញនៃព្រះយេស៊ូវ"}
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
            <h3>{isKorean ? "⚡ 방별 전기요금 계산기" : "⚡ ម៉ាស៊ីនគណនាថ្លៃអគ្គិសនីតាមបន្ទប់"}</h3>
            <p className="page-desc">
              {isKorean 
                ? "전체 요금과 방별 전기 사용량을 입력하면 쓴 만큼 요금을 나눠드립니다." 
                : "បញ្ចូលថ្លៃភ្លើងសរុប និងបរិមាណនៃ'ការប្រើប្រាស់តាមបន្ទប់ ដើម្បីគណនាថ្លៃភ្លើងតាម'ការប្រើប្រាស់ជាក់ស្តែង"}
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
                  <span>{isKorean ? "총 사용량:" : "การប្រើប្រាស់សរុប:"}</span>
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

      {/* 대형 QR 코드가 포함된 푸터 */}
      <footer className="footer">
        <div className="qr-footer-card">
          <div className="qr-image-wrapper">
            <QRCode value={siteUrl} size={110} />
          </div>
          <div className="qr-info">
            <h4>{isKorean ? "스마트폰으로 QR 코드를 스캔하세요" : "ស្កេន QR Code ជាមួយទូរស័ព្ទដៃរបស់អ្នក"}</h4>
            <p>{siteUrl}</p>
            <span>{isKorean ? "친구들과 사이트를 공유하세요!" : "ចែករំលែកគេហទំព័រនេះជាមួយមិត្តភក្តិរបស់អ្នក!"}</span>
          </div>
        </div>
        <p className="copyright">© 2026 moving Cambodia (무빙 캄보디아) Christian Community in Ulsan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;