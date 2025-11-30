import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect } from 'react'

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  useEffect(() => {
    if (offlineReady) {
      toast.success("Pronto para uso offline", {
        description: "O aplicativo foi salvo no cache e pode ser usado sem internet.",
        duration: 5000,
      })
      setOfflineReady(false)
    }
  }, [offlineReady, setOfflineReady])

  useEffect(() => {
    if (needRefresh) {
      toast.info("Nova versão disponível", {
        description: "Clique para atualizar e carregar as novidades.",
        action: {
          label: "Atualizar",
          onClick: () => updateServiceWorker(true)
        },
        duration: Infinity,
      })
    }
  }, [needRefresh, updateServiceWorker])

  return null
}
