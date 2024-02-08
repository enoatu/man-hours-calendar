'use client'

import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { usePersistState } from '@/hooks/usePersistState'
import { firebaseApp } from '@/utils/firebase'

const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

export type GoogleAuthData = {
  email: string,
  uid: string,
}
export type GoogleAuthProps = {
  children: React.ReactNode
}
export const GoogleAuth = ({ children }: GoogleAuthProps)  => {
  const [data, setData] = usePersistState<GoogleAuthData>({ key: 'googleAuth', initialValue: { uid: '', email : '' } })
  const showPopup = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      if (!result?.user?.uid|| !result?.user?.email) {
        throw new Error('user is null')
      }
      setData({ uid: result.user.uid, email: result.user.email })
      location.reload()
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error, errorCode, errorMessage, email, credential)
    });
  }
  return (
    <div>
      { data.email !== '' ?
        <div>
          <p className="inline text-center text-lg font-bold text-green-500">{data.email}でログイン中</p>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setData({ uid: '', email: '' })}>ログアウト</button>
          { children }
        </div>
        :
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={showPopup}>Sign in with Google</button>
      }
    </div>
  );
}

