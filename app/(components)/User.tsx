'use client'

import { useAuth } from '@/src/context/Auth';

export default function User() {
     const [auth] = useAuth();

     console.log('auth', auth)

  return (
    <div>
         <h3> Admin Name : {auth?.user?.name}</h3>
              <h3> Admin Email : {auth?.user?.email}</h3>
    </div>
  )
}
