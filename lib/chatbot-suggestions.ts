import type { ChatbotApiResponse, ChatQuickReplyTag } from '@/types/chatbot.type';

const DEFAULT_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Tìm bút giá rẻ',
    question: 'Tìm bút bi giá rẻ'
  },
  {
    label: 'Chính sách đổi trả',
    question: 'Minaco có chính sách đổi trả không?'
  },
  {
    label: 'Phí vận chuyển',
    question: 'Phí vận chuyển được tính như thế nào?'
  }
];

const RAG_POLICY_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Đổi trả',
    question: 'Minaco có chính sách đổi trả không?'
  },
  {
    label: 'Thanh toán',
    question: 'Minaco hỗ trợ những hình thức thanh toán nào?'
  },
  {
    label: 'Vận chuyển',
    question: 'Chính sách vận chuyển của Minaco như thế nào?'
  },
  {
    label: 'Bảo mật thông tin',
    question: 'Minaco có chính sách bảo mật thông tin khách hàng không?'
  }
];

const RAG_SUPPORT_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Hotline',
    question: 'Hotline của Minaco là gì?'
  },
  {
    label: 'Địa chỉ cửa hàng',
    question: 'Minaco có địa chỉ ở đâu?'
  },
  {
    label: 'Hỗ trợ đặt hàng',
    question: 'Tôi cần hỗ trợ đặt hàng thì liên hệ thế nào?'
  },
  {
    label: 'Thời gian làm việc',
    question: 'Minaco làm việc vào thời gian nào?'
  }
];

const PRODUCT_GENERAL_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Tìm bút',
    question: 'Tìm bút bi cho văn phòng'
  },
  {
    label: 'Tìm giấy A4',
    question: 'Có giấy A4 giá tốt không?'
  },
  {
    label: 'Sản phẩm giá rẻ',
    question: 'Gợi ý văn phòng phẩm giá rẻ'
  }
];

const PRODUCT_BUDGET_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Dưới 50k',
    question: 'Tìm sản phẩm dưới 50k'
  },
  {
    label: 'Dưới 100k',
    question: 'Tìm sản phẩm dưới 100k'
  },
  {
    label: 'Giá rẻ hơn',
    question: 'Có sản phẩm nào rẻ hơn không?'
  }
];

const PRODUCT_COMBO_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Combo văn phòng',
    question: 'Gợi ý combo văn phòng phẩm cho công ty'
  },
  {
    label: 'Mua kèm giấy A4',
    question: 'Mua giấy A4 nên mua kèm gì?'
  },
  {
    label: 'Mua kèm bút',
    question: 'Mua bút bi nên mua kèm gì?'
  }
];

const PRODUCT_QUANTITY_TAGS: ChatQuickReplyTag[] = [
  {
    label: 'Văn phòng 10 người',
    question: 'Văn phòng 10 người nên mua bao nhiêu giấy A4?'
  },
  {
    label: 'Lớp 30 học sinh',
    question: 'Lớp học 30 học sinh nên mua mấy cây bút?'
  },
  {
    label: 'Dùng 1 tháng',
    question: 'Dùng trong 1 tháng thì nên mua bao nhiêu văn phòng phẩm?'
  }
];

export function getChatQuickReplyTags(apiResponse?: ChatbotApiResponse): ChatQuickReplyTag[] {
  if (!apiResponse || !apiResponse.success) {
    return DEFAULT_TAGS;
  }

  if (apiResponse.tool === 'ask_rag') {
    switch (apiResponse.intent) {
      case 'policy':
        return RAG_POLICY_TAGS;

      case 'support':
        return RAG_SUPPORT_TAGS;

      case 'general':
      default:
        return DEFAULT_TAGS;
    }
  }

  if (apiResponse.tool === 'get_product_advisor') {
    switch (apiResponse.advisorIntent) {
      case 'recommend_by_budget':
      case 'cost_saving':
        return PRODUCT_BUDGET_TAGS;

      case 'combo_bundle':
        return PRODUCT_COMBO_TAGS;

      case 'quantity_advice':
        return PRODUCT_QUANTITY_TAGS;

      case 'quality_durability':
        return [
          {
            label: 'Loại bền hơn',
            question: 'Có loại nào bền hơn không?'
          },
          {
            label: 'Dùng cho văn phòng',
            question: 'Loại nào phù hợp dùng lâu dài cho văn phòng?'
          },
          {
            label: 'Thương hiệu tốt',
            question: 'Thương hiệu nào tốt hơn?'
          }
        ];

      case 'brand_fit':
        return [
          {
            label: 'Thiên Long',
            question: 'Sản phẩm Thiên Long nào phù hợp?'
          },
          {
            label: 'Deli',
            question: 'Sản phẩm Deli nào phù hợp?'
          },
          {
            label: 'So sánh thương hiệu',
            question: 'Nên chọn thương hiệu nào tốt hơn?'
          }
        ];

      case 'alternative_product':
        return [
          {
            label: 'Loại tương tự',
            question: 'Có sản phẩm nào tương tự không?'
          },
          {
            label: 'Loại rẻ hơn',
            question: 'Có sản phẩm nào giống vậy nhưng rẻ hơn không?'
          },
          {
            label: 'Loại tốt hơn',
            question: 'Có sản phẩm nào tốt hơn không?'
          }
        ];

      case 'general':
      default:
        return PRODUCT_GENERAL_TAGS;
    }
  }

  return DEFAULT_TAGS;
}
