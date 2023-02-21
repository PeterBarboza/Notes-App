import { useCallback, useEffect } from "react"
import { toast, UpdateOptions } from "react-toastify"

type props = {
  noToastCondition?: boolean 
  noToastCallback?: () => any
  callbackDeps: any[]
  asyncMethod: () => Promise<any>
  errorMessage: string,
  effectDeps?: any[]
  customErrorToastConfig?: UpdateOptions<unknown>
  customLoadingToastMessage?: string
}

export function useLoadingToast({ 
  callbackDeps, 
  errorMessage, 
  asyncMethod, 
  noToastCondition, 
  noToastCallback,
  effectDeps, 
  customErrorToastConfig, 
  customLoadingToastMessage 
}: props) {
  const handleMutationLoading = useCallback(async () => {
    if(noToastCondition) {
      try {
        if(noToastCallback) noToastCallback()
        asyncMethod()
        return
      } catch (error) {
        return
      }
    } 
    const toastId = toast.loading(customLoadingToastMessage || "Carregando...")

    try {
      await asyncMethod()
      toast.dismiss(toastId);
    } catch (err) {
      toast.update(toastId, 
        customErrorToastConfig || 
        { 
          render: errorMessage, 
          type: "error", 
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        }
      ) 
    }
  }, callbackDeps)

  useEffect(() => {
    handleMutationLoading()
  }, effectDeps || [handleMutationLoading])
}