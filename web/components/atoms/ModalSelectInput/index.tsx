import { useMemo, useState } from "react"

import styles from "./styles.module.scss"

type option = {
  id: string
  label: string
  value: string
}

type props = {
  options: option[]
  inputId: string
  inputLabel: string
  inputName: string
  exampleText?: string
  required: boolean
  initialValue: option
  onChange: (value: string) => void
  errors?: string[]
}

export function ModalSelectInput({
  options,
  inputId,
  inputName,
  inputLabel,
  exampleText,
  onChange,
  required,
  initialValue,
  errors = [],
}: props) {
  const [id] = useState(() => `no-option-selected-${Date.now()}`)
  const noOptionSelectedOption = useMemo(() => {
    return {
      id: id,
      label: "--Nenhuma opção selecionada--",
      value: ""
    }
  }, [id])
  const InitialValue = useMemo(() => {
    if (initialValue) {
      return initialValue
    }
    return noOptionSelectedOption
  }, [initialValue, noOptionSelectedOption])
    
  const [selectedOption, setSelectedOption] = useState<option>(InitialValue)
  const [isFocused, setIsFocused] = useState(false)

  const parsedoptions = useMemo(() => {
    if(required) {
      return options
    }
    return [
      noOptionSelectedOption,
      ...options
    ]
  }, [options, required, noOptionSelectedOption])

  return (
    <div className={styles.modalSelectInput}>
      <label htmlFor={inputId}>
        {inputLabel}
        {
          required ?
            <span style={{ color: "#ff3e3e" }}> *</span>
            :
            null
        }
      </label>
      <input
        id={inputId}
        name={inputName}
        className={styles.selectInput}
        placeholder={exampleText}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsFocused(false)
          }, 100)
        }}
        value={selectedOption?.label || ""}
        readOnly={true}
      />
      {
        isFocused ?
        <div className={styles.selectOptionsBox}>
          {
            parsedoptions
            .map((option) => {
              return (
                <div 
                  key={option.id}
                  className={styles.option} 
                  onClick={() => {
                    setSelectedOption(option)
                    onChange(option.value)
                  }}
                >
                  {option.label}
                </div>
              )
            })
          }
        </div>
        :
        null
      }
    </div>
  )
}