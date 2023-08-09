import React from 'react';
type ModalProps = {
  children: React.ReactNode,
  isOpen: boolean,
  closeModal: () => void,
}
export const Modal = ({ children, isOpen, closeModal }: ModalProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 mx-4">
            <div className="p-2">
                {children}
            </div>
            <div className="p-2">
              <button className="py-2 border-2 border-gray-400 w-full text-center hover:bg-gray-400 hover:text-white"
              onClick={() => closeModal()}>
                設定を閉じる
              </button>
            </div>
          </div>
        </div>
        )
      }
    </>
  )
}
