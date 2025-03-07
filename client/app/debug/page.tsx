import DebugPanel from "@/components/debug/debug-panel"

export default function DebugPage() {
  return (
    <div>
      <h1 className="mb-6">API Debug Page</h1>
      <p className="mb-6 text-muted-foreground">
        This page helps debug the mock API by showing the current state of the in-memory data store.
      </p>

      <DebugPanel />
    </div>
  )
}

