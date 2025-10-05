import { Message, TextStreamMessage } from "@/pages/Dashboard/message";
import { groq } from "@ai-sdk/groq";
// Optional Cerebras provider — will be used when USE_CEREBRAS=1 in env
import { createCerebras } from "@ai-sdk/cerebras";
import { generateId, CoreMessage } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import DropFilesView from "@/components/drop-files-view";
import HRDashboard from "@/components/HRDashboard";
import SalesDashboard from "@/components/SalesDashboard";
import MarketingDashboard from "@/components/MarketingDashboard";
import FinanceDashboard from "@/components/FinanceDashboard";
import EngineeringDashboard from "@/components/EngineeringDashboard";
import AppointmentScheduling from "@/components/AppointmentScheduling";
import FileSearch from "@/components/FileSearch";

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;
  // Choose provider/model: default to groq, optionally switch to Cerebras
  const useCerebras = process.env.USE_CEREBRAS === "1" || process.env.USE_CEREBRAS === "true";

  let selectedModel: any = groq("gemma2-9b-it");

  if (useCerebras) {
    const cerebras = createCerebras({
      apiKey: process.env.CEREBRAS_API_KEY ?? "",
    });

    // Example Cerebras model id — change as needed.
    selectedModel = cerebras("llama3.1-8b");
  }

  // Use type assertion to avoid TypeScript compatibility issues
  const { value: stream } = await streamUI({
    model: selectedModel as any,
    system: `
      - You are Dexora, an AI assistant specialized in enterprise document analysis and business intelligence.
      - You help organizations transform their business processes through AI-powered document analysis and insights.
      - Your core capabilities include:
        * Document analysis and extraction of key information
        * Business intelligence and data insights
        * Process automation recommendations
        * Enterprise workflow optimization
        * Custom analysis based on uploaded documents and files
      - You provide professional, accurate, and actionable insights for business users
      - Always offer to analyze documents when users mention having files, reports, or data to review
      - Focus on helping enterprises make data-driven decisions and improve operational efficiency
      - Be professional, clear, and focused on business value in your responses
      - Emphasize your document analysis capabilities for various enterprise file formats
    `,
    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return textComponent;
    },
    tools: {
      // Tool for uploading documents and files for enterprise analysis
      uploadEnterpriseDocuments: {
        description: "Activate this tool when users need to upload or share documents, files, images, or any content for analysis. Responds to phrases like 'upload document', 'share file', 'analyze document', 'scan document', 'upload image', 'discover insights', or any request involving document/file submission for enterprise analysis.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "uploadEnterpriseDocuments",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "uploadEnterpriseDocuments",
                  toolCallId,
                  result: `Displaying a file upload interface for enterprise document analysis`,
                },
              ],
            },
          ]);

          return (
            <Message 
              role="assistant" 
              content={
                <div className="space-y-4">
                  <p className="text-white">
                    Upload your documents or files for AI-powered analysis:
                  </p>
                  <DropFilesView />
                  <p className="text-sm text-slate-400 italic">
                    Supported files: Documents (.pdf, .doc, .docx), Images (.jpg, .png, .gif), 
                    Spreadsheets (.xls, .xlsx), and other enterprise file formats
                  </p>
                </div>
              } 
            />
          );
        },
      },

      // HR Dashboard Tool
      hrDashboard: {
        description: "Activate this tool when users want to view HR data, employee information, staff directory, workforce analytics, or any HR-related requests. Responds to phrases like 'show HR dashboard', 'view employee data', 'staff information', 'HR analytics', 'employee directory', 'personnel records', or 'workforce management'.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "hrDashboard",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "hrDashboard",
                  toolCallId,
                  result: `Displaying HR dashboard with employee data and analytics`,
                },
              ],
            },
          ]);

          return (
            <Message 
              role="assistant" 
              content={
                <div className="space-y-4">
                    <p className="text-white">
                    Here&apos;s your comprehensive HR dashboard with employee data and workforce analytics:
                  </p>
                  <HRDashboard />
                </div>
              } 
            />
          );
        },
      },

      // Sales Dashboard Tool
      salesDashboard: {
        description: "Activate this tool when users want to view sales performance, revenue data, sales analytics, sales metrics, team performance, or any sales-related requests. Responds to phrases like 'show sales dashboard', 'sales performance', 'revenue data', 'sales analytics', 'track sales', 'sales metrics', or 'sales reporting'.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "salesDashboard",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "salesDashboard",
                  toolCallId,
                  result: `Displaying sales dashboard with performance metrics and revenue data`,
                },
              ],
            },
          ]);

          return (
            <Message 
              role="assistant" 
              content={
                <div className="space-y-4">
                  <p className="text-white">
                    Here&apos;s your sales performance dashboard with revenue metrics and team analytics:
                  </p>
                  <SalesDashboard />
                </div>
              } 
            />
          );
        },
      },

      // Marketing Dashboard Tool
      marketingDashboard: {
        description: "Activate this tool when users want to view marketing performance, campaign analytics, marketing metrics, ROI data, or any marketing-related requests. Responds to phrases like 'show marketing dashboard', 'campaign performance', 'marketing analytics', 'track campaigns', 'marketing ROI', 'campaign data', or 'marketing metrics'.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "marketingDashboard",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "marketingDashboard",
                  toolCallId,
                  result: `Displaying marketing dashboard with campaign performance and analytics`,
                },
              ],
            },
          ]);

          return (
            <Message 
              role="assistant" 
              content={
                <div className="space-y-4">
                  <p className="text-white">
                    Here&apos;s your marketing dashboard with campaign performance and ROI analytics:
                  </p>
                  <MarketingDashboard />
                </div>
              } 
            />
          );
        },
      },

      // Finance Dashboard Tool
      financeDashboard: {
        description: "Activate this tool when users want to view financial data, accounting records, budget analysis, income/expense tracking, or any finance-related requests. Responds to phrases like 'show finance dashboard', 'financial data', 'accounting overview', 'track expenses', 'financial analytics', 'accounting records', 'budget analysis', or 'financial reporting'.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "financeDashboard",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "financeDashboard",
                  toolCallId,
                  result: `Displaying finance dashboard with accounting data and financial analytics`,
                },
              ],
            },
          ]);

          return (
            <Message 
              role="assistant" 
              content={
                <div className="space-y-4">
                  <p className="text-white">
                    Here&apos;s your financial dashboard with accounting records and budget analytics:
                  </p>
                  <FinanceDashboard />
                </div>
              } 
            />
          );
        },
      },

      // Engineering Dashboard Tool
      engineeringDashboard: {
        description: "Activate this tool when users want to view engineering data, code snippets, project management, development metrics, or any engineering/development-related requests. Responds to phrases like 'show engineering dashboard', 'code snippets', 'development projects', 'engineering metrics', 'code library', 'project tracking', 'development analytics', or 'engineering tools'.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "engineeringDashboard",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "engineeringDashboard",
                  toolCallId,
                  result: `Displaying engineering dashboard with code snippets and project data`,
                },
              ],
            },
          ]);

          return (
            <Message 
              role="assistant" 
              content={
                <div className="space-y-4">
                  <p className="text-white">
                    Here&apos;s your engineering dashboard with code snippets, project tracking, and development metrics:
                  </p>
                  <EngineeringDashboard />
                </div>
              } 
            />
          );
        },
      },

      // Appointment Scheduling Tool
      appointmentScheduling: {
        description: "Activate this tool when users want to schedule an appointment. Responds to phrases like 'schedule appointment', 'book appointment', 'appointment', 'book a meeting', or 'schedule a meeting'.",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "appointmentScheduling",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "appointmentScheduling",
                  toolCallId,
                  result: `Displaying appointment scheduling interface`,
                },
              ],
            },
          ]);

          return (
            <Message
              role="assistant"
              content={
                <div className="space-y-4">
                  <p className="text-white">Let&apos;s schedule your appointment. Please provide the details below:</p>
                  <AppointmentScheduling />
                </div>
              }
            />
          );
        },
      },

      // File Search Tool
      searchFiles: {
        description: "Activate this tool when users want to search for files, find documents, look up medical records, search patient files, or query their uploaded documents. Responds to phrases like 'search files', 'find document', 'look for file', 'search my records', 'find medical records', 'search for lab results', or any file search requests.",
        parameters: z.object({
          query: z.string().describe("The search query or keywords to find relevant files"),
        }),
        generate: async function* ({ query }) {
          const toolCallId = generateId();
          
          // Generate random file results with citations
          const fileCategories = [
            'Lab Results',
            'Diagnostic Reports',
            'Medical Imaging',
            'Prescriptions',
            'Consultation Notes',
            'Vaccination Records',
          ];

          const sampleCitations = [
            'Blood glucose level: 95 mg/dL (normal range: 70-100 mg/dL)',
            'White blood cell count within normal parameters',
            'Cholesterol levels: HDL 58 mg/dL, LDL 102 mg/dL',
            'X-ray shows no signs of fracture or abnormality',
            'Patient reports decreased symptoms after treatment',
            'Heart rate: 72 bpm, Blood pressure: 120/80 mmHg',
            'CT scan reveals normal tissue density',
            'No adverse reactions to prescribed medication',
            'Follow-up recommended in 3 months',
            'Hemoglobin A1C: 5.4% (non-diabetic range)',
            'Liver function tests within normal limits',
            'Thyroid stimulating hormone (TSH) levels normal',
            'Bone density scan shows healthy bone mass',
            'ECG reveals regular sinus rhythm',
            'MRI scan indicates no abnormal findings',
          ];

          const fileTypes = ['PDF', 'JPEG', 'DICOM', 'PNG', 'DOCX'];
          
          // Generate random number of results (3-8 files)
          const numResults = Math.floor(Math.random() * 6) + 3;
          const results = [];

          for (let i = 0; i < numResults; i++) {
            // Random file size between 0.5 and 15 MB
            const size = (Math.random() * 14.5 + 0.5) * 1024 * 1024;
            
            // Random relevance score between 65 and 99
            const relevanceScore = Math.floor(Math.random() * 35) + 65;
            
            // Random category
            const category = fileCategories[Math.floor(Math.random() * fileCategories.length)];
            
            // Random file type
            const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
            
            // Generate random date within last 2 years
            const daysAgo = Math.floor(Math.random() * 730);
            const uploadDate = new Date();
            uploadDate.setDate(uploadDate.getDate() - daysAgo);
            
            // Select 2-4 random citations
            const numCitations = Math.floor(Math.random() * 3) + 2;
            const shuffledCitations = [...sampleCitations].sort(() => Math.random() - 0.5);
            const citations = shuffledCitations.slice(0, numCitations);

            results.push({
              id: `file-${Date.now()}-${i}`,
              name: `${category.replace(/\s+/g, '_')}_${uploadDate.toISOString().split('T')[0]}.${fileType.toLowerCase()}`,
              type: fileType,
              size: size,
              uploadDate: uploadDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }),
              category: category,
              citations: citations,
              relevanceScore: relevanceScore,
            });
          }

          // Sort by relevance score (highest first)
          results.sort((a, b) => b.relevanceScore - a.relevanceScore);
          
          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "searchFiles",
                  args: { query },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "searchFiles",
                  toolCallId,
                  result: `Found ${results.length} files matching query: "${query}"`,
                },
              ],
            },
          ]);

          return (
            <Message
              role="assistant"
              content={
                <div className="space-y-4">
                  <p className="text-white">
                    I found {results.length} file{results.length !== 1 ? 's' : ''} matching your search for &quot;{query}&quot;. 
                    Each result includes relevant citations from the document content:
                  </p>
                  <FileSearch initialQuery={query} results={results} />
                </div>
              }
            />
          );
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ done }) => { // Removed unused state
    "use server";

    if (done) {
      // save to database
    }
  },
});
