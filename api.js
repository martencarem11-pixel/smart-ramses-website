const SMART_RAMSES_CONFIG = window.SMART_RAMSES_CONFIG || {
  apiBaseUrl: 'http://localhost:3000',
  aiEndpoint: '/api/chat',
  apiMode: 'mock'
};

function buildApiUrl(path) {
  const base = (SMART_RAMSES_CONFIG.apiBaseUrl || '').replace(/\/$/, '');
  const endpoint = (path || SMART_RAMSES_CONFIG.aiEndpoint || '/api/chat').replace(/^\//, '');
  return `${base}/${endpoint}`;
}

function mockHistoryResponse(message) {
  const lower = (message || '').toLowerCase();

  if (lower.includes('abu') || lower.includes('temple') || lower.includes('simbel')) {
    return 'معبد أبو سمبل بني خلال عهد رمسيس الثاني في القرن الثالث عشر قبل الميلاد، وهو من أعظم المشاريع المعمارية في مصر، وقد تم نقله لاحقاً بسبب غمره بمياه السد العالي.';
  }

  if (lower.includes('kadesh') || lower.includes('battle')) {
    return 'معركة قادش كانت من أبرز الحروب بين المصريين والحيثيين، وقد استخدم رمسيس الثاني تكتيكاً قتالياً دقيقاً، لكنه لم يحقق الانتصار الكامل في الميدان رغم إعلان الانتصار السياسي.';
  }

  if (lower.includes('ramses') || lower.includes('pharaoh')) {
    return 'رمسيس الثاني كان من أعظم فراعنة الدولة التاسعة عشرة، وقد حكم مصر في عصر ذهبي من البناء، الحروب، والإنجازات المعمارية.';
  }

  if (lower.includes('pyramid') || lower.includes('great')) {
    return 'الأهرامات تم تشييدها خلال عصر الدولة القديمة، وكانت تُبنى كقبور ملكية، مع استعمال الجرانيت والحجر الجيري وطرق نقل قريبة من النحت والتقدير الهندسي.';
  }

  if (lower.includes('hieroglyph') || lower.includes('writing')) {
    return 'الكتابة الهيروغليفية كانت نظاماً صورياً استخدم في مصر القديمة، واحتوت على رموز تعبر عن أصوات وكلمات، وكانت تستخدم للكتابة الدينية والسجل الملكي.';
  }

  return 'في الحضارة المصرية القديمة، كان للعلم والآثار والمعابد دور محوري في الحياة اليومية. إذا أردت، أستطيع أن أشرح لك هذا الموضوع بشكل أعمق مع تواريخ ومراجع تاريخية.';
}

async function sendChatMessage({ message, conversationId = null }) {
  const payload = {
    message,
    conversation_id: conversationId,
    language: 'en',
    include_sources: true
  };

  if (SMART_RAMSES_CONFIG.apiMode === 'live') {
    try {
      const response = await fetch(buildApiUrl(SMART_RAMSES_CONFIG.aiEndpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Live API failed');
      }

      const result = await response.json();
      return result.answer || result.message || 'No answer returned.';
    } catch (error) {
      return mockHistoryResponse(message);
    }
  }

  return mockHistoryResponse(message);
}

window.RamsesAPI = {
  sendChatMessage
};
