import { ActivityLog, AppSettings, BackupData, ClassRoom, GamePreset, QuestionSet, QuizQuestion, TeamScore } from '../types';

const DB_NAME = 'ClassroomGameHubDB';
const DB_VERSION = 2;
const STORE_CLASSES = 'classes';
const STORE_QUESTIONS = 'questions';
const STORE_QUESTION_SETS = 'question_sets';
const STORE_GAME_PRESETS = 'game_presets';
const STORE_SCORES = 'scores';
const STORE_LOGS = 'activity_logs';
const LOCAL_SETTINGS_KEY = 'cgh_app_settings';

export const DEFAULT_CLASSES: ClassRoom[] = [
  {
    id: 'class-11a1',
    name: '11A1',
    subject: 'Tin học & Công nghệ',
    schoolYear: '2025 - 2026',
    createdAt: Date.now() - 86400000 * 30,
    students: [
      { id: 'hs-01', name: 'Nguyễn Văn An', code: '11A1-01', gender: 'male' },
      { id: 'hs-02', name: 'Trần Thị Bích', code: '11A1-02', gender: 'female' },
      { id: 'hs-03', name: 'Lê Hoàng Cường', code: '11A1-03', gender: 'male' },
      { id: 'hs-04', name: 'Phạm Minh Đức', code: '11A1-04', gender: 'male' },
      { id: 'hs-05', name: 'Đỗ Quỳnh Giang', code: '11A1-05', gender: 'female' },
      { id: 'hs-06', name: 'Vũ Quốc Huy', code: '11A1-06', gender: 'male' },
      { id: 'hs-07', name: 'Hoàng Mai Hương', code: '11A1-07', gender: 'female' },
      { id: 'hs-08', name: 'Bùi Gia Khang', code: '11A1-08', gender: 'male' },
      { id: 'hs-09', name: 'Đinh Tuấn Kiệt', code: '11A1-09', gender: 'male' },
      { id: 'hs-10', name: 'Ngô Thùy Linh', code: '11A1-10', gender: 'female' },
      { id: 'hs-11', name: 'Dương Nhật Minh', code: '11A1-11', gender: 'male' },
      { id: 'hs-12', name: 'Lý Trúc My', code: '11A1-12', gender: 'female' },
      { id: 'hs-13', name: 'Võ Phương Nam', code: '11A1-13', gender: 'male' },
      { id: 'hs-14', name: 'Phan Yến Nhi', code: '11A1-14', gender: 'female' },
      { id: 'hs-15', name: 'Hồ Tấn Phát', code: '11A1-15', gender: 'male' },
      { id: 'hs-16', name: 'Cao Như Quỳnh', code: '11A1-16', gender: 'female' },
      { id: 'hs-17', name: 'Mai Thái Sơn', code: '11A1-17', gender: 'male' },
      { id: 'hs-18', name: 'Đặng Thanh Thảo', code: '11A1-18', gender: 'female' },
      { id: 'hs-19', name: 'Trịnh Bảo Trâm', code: '11A1-19', gender: 'female' },
      { id: 'hs-20', name: 'Lưu Quang Vinh', code: '11A1-20', gender: 'male' },
      { id: 'hs-21', name: 'Đoàn Hải Yến', code: '11A1-21', gender: 'female' },
      { id: 'hs-22', name: 'Tạ Minh Khôi', code: '11A1-22', gender: 'male' },
      { id: 'hs-23', name: 'Nguyễn Lan Anh', code: '11A1-23', gender: 'female' },
      { id: 'hs-24', name: 'Chu Đình Trọng', code: '11A1-24', gender: 'male' },
    ],
  },
  {
    id: 'class-10a2',
    name: '10A2',
    subject: 'Tiếng Anh',
    schoolYear: '2025 - 2026',
    createdAt: Date.now() - 86400000 * 20,
    students: [
      { id: 'hs-101', name: 'Nguyễn Hải Đăng', code: '10A2-01', gender: 'male' },
      { id: 'hs-102', name: 'Lê Thảo My', code: '10A2-02', gender: 'female' },
      { id: 'hs-103', name: 'Trần Đăng Khoa', code: '10A2-03', gender: 'male' },
      { id: 'hs-104', name: 'Vũ Ngọc Hân', code: '10A2-04', gender: 'female' },
      { id: 'hs-105', name: 'Phạm Gia Huy', code: '10A2-05', gender: 'male' },
      { id: 'hs-106', name: 'Đặng Kim Ngân', code: '10A2-06', gender: 'female' },
      { id: 'hs-107', name: 'Bùi Đức Anh', code: '10A2-07', gender: 'male' },
      { id: 'hs-108', name: 'Lâm Tuệ Mẫn', code: '10A2-08', gender: 'female' },
    ],
  },
];

export const DEFAULT_QUESTION_SETS: QuestionSet[] = [
  {
    id: 'set-tin-hoc-11',
    name: 'Tin học 11 - Nhập môn Web & Lập trình',
    subject: 'Tin học',
    description: 'Bộ câu hỏi kiến thức nền tảng về HTML, CSS, JavaScript và tư duy thuật toán.',
    tags: ['Tin học 11', 'Web', 'JavaScript', 'HTML'],
    createdAt: Date.now() - 86400000 * 5,
    questionCount: 7,
  },
  {
    id: 'set-khoa-hoc-do-vui',
    name: 'Khoa học Tự nhiên & Đố vui Khám phá',
    subject: 'Khoa học',
    description: 'Câu hỏi khám phá vũ trụ, tự nhiên, sinh học và các câu đố phản xạ trí tuệ.',
    tags: ['Khoa học', 'Tự nhiên', 'Đố vui'],
    createdAt: Date.now() - 86400000 * 4,
    questionCount: 4,
  },
  {
    id: 'set-tieng-anh-giao-tiep',
    name: 'Tiếng Anh - Từ vựng & Ngữ pháp',
    subject: 'Tiếng Anh',
    description: 'Bộ ôn tập từ vựng, từ đồng nghĩa và thành ngữ thông dụng trong giao tiếp.',
    tags: ['Tiếng Anh', 'Vocabulary', 'Grammar'],
    createdAt: Date.now() - 86400000 * 3,
    questionCount: 2,
  },
  {
    id: 'set-toan-hoc-tu-duy',
    name: 'Toán học & Tư duy Logic',
    subject: 'Toán học',
    description: 'Các bài toán nhanh, dãy số quy luật và hình học trực quan.',
    tags: ['Toán học', 'Logic', 'Số học'],
    createdAt: Date.now() - 86400000 * 2,
    questionCount: 2,
  },
];

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  // 1. Multiple Choice
  {
    id: 'q-1',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 1: Lập trình Web',
    topic: 'JavaScript căn bản',
    tags: ['JavaScript', 'Web', 'Frontend'],
    type: 'multiple-choice',
    question: 'JavaScript thường được sử dụng cho mục đích chính nào sau đây trên trình duyệt?',
    options: [
      'Thiết kế cấu trúc bảng cơ sở dữ liệu',
      'Tạo tương tác động và xử lý logic cho website',
      'Chỉ dùng để định kiểu màu sắc CSS',
      'Chỉ chạy trên hệ thống máy chủ'
    ],
    answer: 1,
    explanation: 'JavaScript là ngôn ngữ chạy trực tiếp trên trình duyệt để xử lý sự kiện, hiệu ứng và tương tác người dùng.',
    hint: 'Nghĩ về các nút bấm, popup và hoạt ảnh động trên trang web.',
    points: 10,
    difficulty: 'easy',
    isFavorite: true,
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 2. True / False
  {
    id: 'q-2',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 1: Lập trình Web',
    topic: 'Khái niệm ngôn ngữ',
    tags: ['HTML', 'Khái niệm'],
    type: 'true-false',
    question: 'HTML được xem là một ngôn ngữ lập trình hoàn chỉnh có thể tính toán logic.',
    options: ['Đúng (True)', 'Sai (False)'],
    answer: false,
    explanation: 'HTML là ngôn ngữ đánh dấu siêu văn bản (HyperText Markup Language), dùng để định hình khung sườn trang, không có khả năng tính toán logic như ngôn ngữ lập trình.',
    hint: 'HTML có viết được vòng lặp for hay câu lệnh if/else không?',
    points: 10,
    difficulty: 'easy',
    isFavorite: false,
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 3. Short Answer
  {
    id: 'q-3',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 1: Lập trình Web',
    topic: 'Lịch sử công nghệ',
    tags: ['Java', 'Lịch sử'],
    type: 'short-answer',
    question: 'Ngôn ngữ lập trình hướng đối tượng nào ra mắt năm 1995 bởi công ty Sun Microsystems?',
    answer: 'Java',
    explanation: 'Java được James Gosling và nhóm kỹ sư tại Sun Microsystems phát hành vào năm 1995 với slogan "Write Once, Run Anywhere".',
    hint: 'Tên ngôn ngữ này trùng với tên một loại hạt cà phê nổi tiếng.',
    points: 15,
    difficulty: 'medium',
    isFavorite: true,
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 4. Fill in the Blank
  {
    id: 'q-4',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 1: Lập trình Web',
    topic: 'Kiến trúc Web',
    tags: ['CSS', 'Giao diện'],
    type: 'fill-blank',
    question: 'Trong thiết kế web, HTML dùng để tạo cấu trúc, còn CSS dùng để định dạng ______ cho trang.',
    answer: 'giao diện',
    explanation: 'CSS (Cascading Style Sheets) đảm nhiệm việc định dạng màu sắc, bố cục và giao diện hiển thị cho website.',
    hint: 'Từ gồm 2 tiếng: g... d...',
    points: 10,
    difficulty: 'easy',
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 5. Matching
  {
    id: 'q-5',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 1: Lập trình Web',
    topic: 'Phân loại công nghệ',
    tags: ['Phân loại', 'Ghép đôi'],
    type: 'matching',
    question: 'Hãy ghép nối công nghệ ở cột trái với vai trò tương ứng ở cột phải:',
    matchingPairs: [
      { left: 'HTML', right: 'Ngôn ngữ đánh dấu cấu trúc tài liệu' },
      { left: 'CSS', right: 'Ngôn ngữ định dạng trang trí giao diện' },
      { left: 'JavaScript', right: 'Ngôn ngữ lập trình xử lý tương tác' },
      { left: 'SQL', right: 'Ngôn ngữ truy vấn cơ sở dữ liệu' },
    ],
    answer: 'matched',
    explanation: 'Mỗi công nghệ giữ một trụ cột độc lập trong hệ thống ứng dụng web hiện đại.',
    points: 20,
    difficulty: 'medium',
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 6. Ordering
  {
    id: 'q-6',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 2: Quy trình phát triển',
    topic: 'Quy trình thực thi mã nguồn',
    tags: ['Quy trình', 'Thuật toán'],
    type: 'ordering',
    question: 'Sắp xếp các bước phát triển phần mềm theo đúng thứ tự tiêu chuẩn:',
    orderItems: [
      'Phân tích yêu cầu bài toán',
      'Viết mã nguồn (Coding)',
      'Biên dịch và gỡ lỗi (Compile & Debug)',
      'Kiểm thử và bàn giao (Test & Deploy)',
    ],
    answer: [0, 1, 2, 3],
    explanation: 'Quy trình phần mềm bắt đầu từ khảo sát nhu cầu, tiếp đến code, biên dịch sửa lỗi và sau cùng là kiểm thử bàn giao.',
    points: 20,
    difficulty: 'hard',
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 7. Multiple Answer
  {
    id: 'q-7',
    category: 'Tin học',
    subject: 'Tin học',
    chapter: 'Chương 2: Lập trình hướng đối tượng',
    topic: 'Ngôn ngữ OOP',
    tags: ['OOP', 'Nâng cao'],
    type: 'multiple-answer',
    question: 'Những ngôn ngữ nào sau đây hỗ trợ lập trình hướng đối tượng (OOP)? (Chọn nhiều đáp án)',
    options: ['Java', 'C++', 'Python', 'HTML thuần túy'],
    answer: [0, 1, 2],
    explanation: 'Java, C++ và Python đều là các ngôn ngữ lập trình hướng đối tượng mạnh mẽ. HTML chỉ là ngôn ngữ đánh dấu siêu văn bản.',
    hint: 'Có 3 ngôn ngữ lập trình thực thụ trong các lựa chọn.',
    points: 15,
    difficulty: 'medium',
    setId: 'set-tin-hoc-11',
    createdAt: Date.now() - 86400000 * 5,
  },
  // 8. Image Question
  {
    id: 'q-8',
    category: 'Khoa học',
    subject: 'Khoa học',
    chapter: 'Vũ trụ học',
    topic: 'Hệ Mặt Trời',
    tags: ['Vũ trụ', 'Sao Hỏa', 'Hành tinh'],
    type: 'image-question',
    question: 'Hành tinh trong hình ảnh có màu đỏ cam đặc trưng do bề mặt giàu oxit sắt. Đây là hành tinh nào?',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
    options: ['Sao Kim (Venus)', 'Sao Hỏa (Mars)', 'Sao Thủy (Mercury)', 'Sao Mộc (Jupiter)'],
    answer: 1,
    explanation: 'Sao Hỏa (Mars) có màu đỏ rực rỡ nhìn thấy từ Trái Đất nhờ lượng oxit sắt lớn trên bề mặt.',
    hint: 'Hành tinh thứ 4 tính từ Mặt Trời.',
    points: 15,
    difficulty: 'easy',
    isFavorite: true,
    setId: 'set-khoa-hoc-do-vui',
    createdAt: Date.now() - 86400000 * 4,
  },
  // 9. Khoa học Multiple Choice
  {
    id: 'q-9',
    category: 'Khoa học',
    subject: 'Khoa học',
    chapter: 'Sinh học & Con người',
    topic: 'Cơ thể người',
    tags: ['Sinh học', 'Con người'],
    type: 'multiple-choice',
    question: 'Cơ quan nào trong cơ thể con người có khả năng tự tái sinh mô khi bị tổn thương nhẹ?',
    options: ['Tim', 'Gan', 'Phổi', 'Não bộ'],
    answer: 1,
    explanation: 'Gan là cơ quan nội tạng duy nhất có khả năng tự tái tạo các tế bào bị mất ngay cả khi bị cắt bỏ tới 70%.',
    hint: 'Cơ quan thanh lọc độc tố lớn nhất trong ổ bụng.',
    points: 10,
    difficulty: 'medium',
    setId: 'set-khoa-hoc-do-vui',
    createdAt: Date.now() - 86400000 * 4,
  },
  // 10. Đố vui True / False
  {
    id: 'q-10',
    category: 'Khoa học',
    subject: 'Khoa học',
    chapter: 'Vật lý vui',
    topic: 'Ánh sáng và âm thanh',
    tags: ['Vật lý', 'Phản xạ'],
    type: 'true-false',
    question: 'Trong môi trường chân không ngoài không gian vũ trụ, con người vẫn có thể nghe thấy tiếng nổ lớn.',
    options: ['Đúng (True)', 'Sai (False)'],
    answer: false,
    explanation: 'Âm thanh là sóng cơ học cần môi trường vật chất (không khí, nước, chất rắn) để truyền đi. Vũ trụ là chân không nên âm thanh không thể truyền qua.',
    hint: 'Sóng âm có truyền được qua chân không không?',
    points: 10,
    difficulty: 'easy',
    setId: 'set-khoa-hoc-do-vui',
    createdAt: Date.now() - 86400000 * 4,
  },
  // 11. Đố vui Short Answer
  {
    id: 'q-11',
    category: 'Khoa học',
    subject: 'Khoa học',
    chapter: 'Đố mẹo dân gian',
    topic: 'Câu đố mẹo',
    tags: ['Đố mẹo', 'Hài hước'],
    type: 'short-answer',
    question: 'Cái gì bạn có thể cầm bằng tay phải nhưng không bao giờ cầm được bằng chính bàn tay trái?',
    answer: 'Cùi chỏ tay trái',
    explanation: 'Bàn tay trái không thể nào tự vươn tới để nắm lấy chính cùi chỏ cánh tay trái của mình.',
    hint: 'Một bộ phận ở cánh tay.',
    points: 15,
    difficulty: 'easy',
    isFavorite: true,
    setId: 'set-khoa-hoc-do-vui',
    createdAt: Date.now() - 86400000 * 4,
  },
  // 12. Tiếng Anh Multiple Choice
  {
    id: 'q-12',
    category: 'Tiếng Anh',
    subject: 'Tiếng Anh',
    chapter: 'Unit 1: Expanding Vocabulary',
    topic: 'Synonyms',
    tags: ['Vocabulary', 'Synonym'],
    type: 'multiple-choice',
    question: 'Which word is the CLOSEST in meaning to "Enormous"?',
    options: ['Tiny', 'Gigantic', 'Fragile', 'Ancient'],
    answer: 1,
    explanation: 'Gigantic means extremely large or huge, which is a direct synonym of Enormous.',
    hint: 'Think of giant monsters.',
    points: 10,
    difficulty: 'easy',
    isFavorite: true,
    setId: 'set-tieng-anh-giao-tiep',
    createdAt: Date.now() - 86400000 * 3,
  },
  // 13. Tiếng Anh Matching
  {
    id: 'q-13',
    category: 'Tiếng Anh',
    subject: 'Tiếng Anh',
    chapter: 'Unit 2: Opposites',
    topic: 'Antonyms',
    tags: ['Antonyms', 'Vocabulary'],
    type: 'matching',
    question: 'Match each English adjective with its opposite antonym:',
    matchingPairs: [
      { left: 'Generous (Hào phóng)', right: 'Stingy (Keo kiệt)' },
      { left: 'Optimistic (Lạc quan)', right: 'Pessimistic (Bi quan)' },
      { left: 'Brave (Dũng cảm)', right: 'Cowardly (Nhút nhát)' },
      { left: 'Polite (Lịch sự)', right: 'Rude (Thô lỗ)' },
    ],
    answer: 'matched',
    explanation: 'Cặp từ trái nghĩa giúp nâng cao vốn từ vựng miêu tả tính cách con người.',
    points: 20,
    difficulty: 'medium',
    setId: 'set-tieng-anh-giao-tiep',
    createdAt: Date.now() - 86400000 * 3,
  },
  // 14. Toán học Multiple Choice
  {
    id: 'q-14',
    category: 'Toán học',
    subject: 'Toán học',
    chapter: 'Chương 1: Số học & Dãy số',
    topic: 'Quy luật dãy số',
    tags: ['Dãy số', 'Logic'],
    type: 'multiple-choice',
    question: 'Số tiếp theo trong dãy số quy luật: 2, 4, 8, 16, 32, ... là số nào?',
    options: ['48', '60', '64', '72'],
    answer: 2,
    explanation: 'Mỗi số sau bằng số trước nhân với 2 (lũy thừa của 2). Do đó 32 x 2 = 64.',
    hint: 'Nhân đôi số trước đó.',
    points: 10,
    difficulty: 'easy',
    setId: 'set-toan-hoc-tu-duy',
    createdAt: Date.now() - 86400000 * 2,
  },
  // 15. Toán học True / False
  {
    id: 'q-15',
    category: 'Toán học',
    subject: 'Toán học',
    chapter: 'Chương 1: Số nguyên tố',
    topic: 'Định nghĩa số nguyên tố',
    tags: ['Số nguyên tố'],
    type: 'true-false',
    question: 'Số 2 là số chẵn duy nhất nằm trong tập hợp các số nguyên tố.',
    options: ['Đúng (True)', 'Sai (False)'],
    answer: true,
    explanation: 'Số 2 chỉ chia hết cho 1 và chính nó, là số nguyên tố chẵn duy nhất. Tất cả các số chẵn lớn hơn 2 đều chia hết cho 2 nên đều là hợp số.',
    points: 10,
    difficulty: 'easy',
    isFavorite: true,
    setId: 'set-toan-hoc-tu-duy',
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const DEFAULT_SCORES: TeamScore[] = [
  { id: 'team-1', name: 'Team Lửa', color: 'bg-red-500', emoji: '🔥', score: 0 },
  { id: 'team-2', name: 'Team Nước', color: 'bg-blue-500', emoji: '💧', score: 0 },
  { id: 'team-3', name: 'Team Đất', color: 'bg-emerald-500', emoji: '🌱', score: 0 },
  { id: 'team-4', name: 'Team Sấm Sét', color: 'bg-amber-500', emoji: '⚡', score: 0 },
];

export const DEFAULT_GAME_PRESETS: GamePreset[] = [
  {
    id: 'preset-quick-battle',
    name: 'Đấu Trí Trắc Nghiệm - 10 câu ôn bài',
    gameId: 'quiz-challenge',
    config: {
      gameId: 'quiz-challenge',
      gameName: 'Đấu Trí Trắc Nghiệm',
      source: 'all',
      questionCount: 10,
      difficulties: ['easy', 'medium'],
      randomQuestions: true,
      randomOrder: true,
      randomOptions: true,
      timePerQuestion: 30,
      pointsCorrect: 10,
      pointsWrong: -5,
    },
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'preset-mystery-11a1',
    name: 'Hộp Quà Bí Mật - Lớp 11A1',
    gameId: 'mystery-box',
    config: {
      gameId: 'mystery-box',
      gameName: 'Hộp Quà Bí Mật',
      source: 'set',
      setId: 'set-tin-hoc-11',
      questionCount: 12,
      difficulties: ['easy', 'medium', 'hard'],
      randomQuestions: true,
      randomOrder: true,
      randomOptions: true,
      timePerQuestion: 25,
      pointsCorrect: 20,
      pointsWrong: 0,
    },
    createdAt: Date.now() - 86400000,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  sound: true,
  animation: true,
  language: 'vi',
  activeClassId: 'class-11a1',
  presentationMode: false,
};

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_CLASSES)) {
        db.createObjectStore(STORE_CLASSES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUESTIONS)) {
        db.createObjectStore(STORE_QUESTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_QUESTION_SETS)) {
        db.createObjectStore(STORE_QUESTION_SETS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_GAME_PRESETS)) {
        db.createObjectStore(STORE_GAME_PRESETS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SCORES)) {
        db.createObjectStore(STORE_SCORES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        db.createObjectStore(STORE_LOGS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generic IndexedDB read/write helpers
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB read failed for ${storeName}, falling back to localStorage`, err);
    const cached = localStorage.getItem(`cgh_${storeName}`);
    return cached ? JSON.parse(cached) : [];
  }
}

async function saveAllToStore<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
  try {
    localStorage.setItem(`cgh_${storeName}`, JSON.stringify(items));
  } catch {
    // ignore
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`IndexedDB save failed for ${storeName}`, err);
  }
}

// Classes
export async function getClasses(): Promise<ClassRoom[]> {
  const classes = await getAllFromStore<ClassRoom>(STORE_CLASSES);
  if (classes.length === 0) {
    await saveAllToStore(STORE_CLASSES, DEFAULT_CLASSES);
    return DEFAULT_CLASSES;
  }
  return classes;
}

export async function saveClasses(classes: ClassRoom[]): Promise<void> {
  await saveAllToStore(STORE_CLASSES, classes);
}

// Question Sets
export async function getQuestionSets(): Promise<QuestionSet[]> {
  const sets = await getAllFromStore<QuestionSet>(STORE_QUESTION_SETS);
  if (sets.length === 0) {
    await saveAllToStore(STORE_QUESTION_SETS, DEFAULT_QUESTION_SETS);
    return DEFAULT_QUESTION_SETS;
  }
  return sets;
}

export async function saveQuestionSets(sets: QuestionSet[]): Promise<void> {
  await saveAllToStore(STORE_QUESTION_SETS, sets);
}

// Game Presets
export async function getGamePresets(): Promise<GamePreset[]> {
  const presets = await getAllFromStore<GamePreset>(STORE_GAME_PRESETS);
  if (presets.length === 0) {
    await saveAllToStore(STORE_GAME_PRESETS, DEFAULT_GAME_PRESETS);
    return DEFAULT_GAME_PRESETS;
  }
  return presets;
}

export async function saveGamePresets(presets: GamePreset[]): Promise<void> {
  await saveAllToStore(STORE_GAME_PRESETS, presets);
}

// Questions
export async function getQuestions(): Promise<QuizQuestion[]> {
  const questions = await getAllFromStore<QuizQuestion>(STORE_QUESTIONS);
  if (questions.length === 0) {
    await saveAllToStore(STORE_QUESTIONS, DEFAULT_QUESTIONS);
    return DEFAULT_QUESTIONS;
  }
  return questions;
}

export async function saveQuestions(questions: QuizQuestion[]): Promise<void> {
  await saveAllToStore(STORE_QUESTIONS, questions);
}

// Scores
export async function getScores(): Promise<TeamScore[]> {
  const scores = await getAllFromStore<TeamScore>(STORE_SCORES);
  if (scores.length === 0) {
    await saveAllToStore(STORE_SCORES, DEFAULT_SCORES);
    return DEFAULT_SCORES;
  }
  return scores;
}

export async function saveScores(scores: TeamScore[]): Promise<void> {
  await saveAllToStore(STORE_SCORES, scores);
}

// Activity Logs
export async function getActivityLogs(): Promise<ActivityLog[]> {
  const logs = await getAllFromStore<ActivityLog>(STORE_LOGS);
  return logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
}

export async function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now(),
  };

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_LOGS, 'readwrite');
    const store = tx.objectStore(STORE_LOGS);
    store.put(newLog);
  } catch (err) {
    console.warn('Failed to add log to IndexedDB:', err);
  }

  return newLog;
}

export async function clearActivityLogs(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_LOGS, 'readwrite');
    const store = tx.objectStore(STORE_LOGS);
    store.clear();
  } catch (err) {
    console.warn('Failed to clear logs:', err);
  }
  localStorage.removeItem(`cgh_${STORE_LOGS}`);
}

// Settings (Stored in localStorage for instant sync)
export function getAppSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.warn('Failed to read settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveAppSettings(settings: Partial<AppSettings>): void {
  try {
    const current = getAppSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}

// Backup & Export / Import
export async function exportAllData(): Promise<string> {
  const [classes, questions, questionSets, gamePresets, scores, activityLogs] = await Promise.all([
    getClasses(),
    getQuestions(),
    getQuestionSets(),
    getGamePresets(),
    getScores(),
    getActivityLogs(),
  ]);

  const backup: BackupData = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    classes,
    questions,
    questionSets,
    gamePresets,
    scores,
    activityLogs,
    settings: getAppSettings(),
  };

  return JSON.stringify(backup, null, 2);
}

export async function importBackupData(jsonString: string): Promise<boolean> {
  try {
    const data: BackupData = JSON.parse(jsonString);
    if (!data.classes || !Array.isArray(data.classes)) {
      throw new Error('Dữ liệu sao lưu không hợp lệ (thiếu danh sách lớp)');
    }

    if (data.classes.length > 0) await saveClasses(data.classes);
    if (data.questions && Array.isArray(data.questions)) await saveQuestions(data.questions);
    if (data.questionSets && Array.isArray(data.questionSets)) await saveQuestionSets(data.questionSets);
    if (data.gamePresets && Array.isArray(data.gamePresets)) await saveGamePresets(data.gamePresets);
    if (data.scores && Array.isArray(data.scores)) await saveScores(data.scores);
    if (data.activityLogs && Array.isArray(data.activityLogs)) await saveAllToStore(STORE_LOGS, data.activityLogs);
    if (data.settings) saveAppSettings(data.settings);

    return true;
  } catch (err) {
    console.error('Lỗi khi import backup:', err);
    throw err;
  }
}

export async function resetToDefaultData(): Promise<void> {
  await saveAllToStore(STORE_CLASSES, DEFAULT_CLASSES);
  await saveAllToStore(STORE_QUESTIONS, DEFAULT_QUESTIONS);
  await saveAllToStore(STORE_QUESTION_SETS, DEFAULT_QUESTION_SETS);
  await saveAllToStore(STORE_GAME_PRESETS, DEFAULT_GAME_PRESETS);
  await saveAllToStore(STORE_SCORES, DEFAULT_SCORES);
  await saveAllToStore(STORE_LOGS, []);
}

export const StorageService = {
  getClasses,
  saveClasses,
  getQuizQuestions: getQuestions,
  saveQuizQuestions: saveQuestions,
  saveQuizQuestion: async (q: QuizQuestion): Promise<QuizQuestion[]> => {
    const list = await getQuestions();
    const existingIndex = list.findIndex((item) => item.id === q.id);
    let updated: QuizQuestion[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = q;
    } else {
      updated = [q, ...list];
    }
    await saveQuestions(updated);
    return updated;
  },
  deleteQuizQuestion: async (id: string): Promise<QuizQuestion[]> => {
    const list = await getQuestions();
    const updated = list.filter((item) => item.id !== id);
    await saveQuestions(updated);
    return updated;
  },
  bulkDeleteQuizQuestions: async (ids: string[]): Promise<QuizQuestion[]> => {
    const set = new Set(ids);
    const list = await getQuestions();
    const updated = list.filter((item) => !set.has(item.id));
    await saveQuestions(updated);
    return updated;
  },
  getQuestionSets,
  saveQuestionSets,
  saveQuestionSet: async (s: QuestionSet): Promise<QuestionSet[]> => {
    const list = await getQuestionSets();
    const existingIndex = list.findIndex((item) => item.id === s.id);
    let updated: QuestionSet[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = s;
    } else {
      updated = [s, ...list];
    }
    await saveQuestionSets(updated);
    return updated;
  },
  deleteQuestionSet: async (id: string): Promise<QuestionSet[]> => {
    const list = await getQuestionSets();
    const updated = list.filter((item) => item.id !== id);
    await saveQuestionSets(updated);
    return updated;
  },
  getGamePresets,
  saveGamePresets,
  saveGamePreset: async (preset: GamePreset): Promise<GamePreset[]> => {
    const list = await getGamePresets();
    const existingIndex = list.findIndex((item) => item.id === preset.id);
    let updated: GamePreset[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = preset;
    } else {
      updated = [preset, ...list];
    }
    await saveGamePresets(updated);
    return updated;
  },
  getTeamScores: getScores,
  saveTeamScores: saveScores,
  getActivityLogs,
  clearActivityLogs,
  addActivityLog: async (title: string, details?: string) => {
    await addActivityLog({
      classId: '',
      className: '',
      actionType: 'game_played',
      title,
      details,
    });
    return {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      classId: '',
      className: '',
      actionType: 'game_played' as const,
      title,
      details,
    };
  },
  getSettings: getAppSettings,
  saveSettings: saveAppSettings,
  resetToDefaults: resetToDefaultData,
  exportAll: exportAllData,
  importAll: importBackupData,
};
