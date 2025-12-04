import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const MenuOption = [
    {
        name:"Dashboard",
        path:"/dashboard"
    },
    {
        name:"Upgrade",
        path:"/upgrade"
    },
    {
        name:"How it works?",
        path:"/how-it-works"
    }
]

function AppHeader() {
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-2">
            <Image src={'/logo.svg'} alt="logo" width={42} height={42}/>
            <h1 className="text-base font-bold md:text-2xl">Ai Mock Interview</h1>
        </div>
        <div>

        </div>
        <UserButton/>
    </nav>
  )
}

export default AppHeader