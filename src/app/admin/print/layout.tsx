import '@/components/proposals/planner/planner.css'
import '@/components/proposals/proposals.css'

/* Print pages: one document on a white page, outside the GoldPass shell.
   Chrome prints these for PDF downloads and email attachments
   (src/lib/proposals/server.ts); they also open in a browser as a preview. */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return children
}
