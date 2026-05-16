export type ChatToolName = 'ask_rag' | 'get_product_advisor';

export type ChatResponseIntent = 'policy' | 'support' | 'general' | 'product';

export type ProductAdvisorIntent =
  | 'general'
  | 'recommend_by_budget'
  | 'quality_durability'
  | 'brand_fit'
  | 'cost_saving'
  | 'combo_bundle'
  | 'alternative_product'
  | 'quantity_advice';

export type ProductAdvisorSortBy = 'relevant' | 'price_asc' | 'price_desc';

export type ProductSelectionMode = 'none' | 'direct' | 'ai';

export type ProductAdvisorFilter = {
  keyword?: string;
  audience?: string;
  need?: string;
  category?: string;
  brand?: string;
  budgetMin?: number;
  budgetMax?: number;
  sortBy?: ProductAdvisorSortBy;
  limit?: number;
};

export type ChatTokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type QuantityAdvice = {
  subjectCount: number;
  subjectLabel: string;
  productKeyword: string;
  recommendedMin: number;
  recommendedMax: number;
  unit: string;
  formula: string;
  note: string;
};

export type ProductAdvisorItem = {
  productId?: string;
  id?: string;

  variantId?: string;
  sku?: string;

  productName: string;
  variantName?: string;

  price: number;
  compareAtPrice?: number;
  stock?: number;

  variantImage?: string;
  productUrl?: string;

  aiReason?: string;
  aiScore?: number;
};

export type ChatbotSuccessResponse = {
  success: true;

  tool: ChatToolName;

  intent: ChatResponseIntent;

  response: string;

  advisorIntent?: ProductAdvisorIntent;
  filter?: ProductAdvisorFilter;
  total?: number;
  candidateCount?: number;
  selectionMode?: ProductSelectionMode;
  items?: ProductAdvisorItem[];

  quantityAdvice?: QuantityAdvice;

  contextUsed?: number;

  tokenUsage?: ChatTokenUsage;
};

export type ChatbotErrorResponse = {
  success: false;
  tool: ChatToolName;
  intent: ChatResponseIntent;
  response: string;
  message: string;
  tokenUsage?: ChatTokenUsage;
};

export type ChatbotApiResponse = ChatbotSuccessResponse | ChatbotErrorResponse;

export type ProductAdvisorResponse = ChatbotSuccessResponse & {
  success: true;
  intent: 'product';
  items: ProductAdvisorItem[];
};

export type ChatbotQueryRequest = {
  question: string;
};

export type ChatMessageWithApiResponse = {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  apiResponse?: ChatbotApiResponse;
};

export type ChatQuickReplyTag = {
  label: string;
  question: string;
};
