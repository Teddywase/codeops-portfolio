import React from 'react'
import './Main.css'
import Menu from './Menu/Menu'
import SideBar from './SideBar/SideBar'

function Main() {
    return (
        <section className='main'>
            <Menu />
            <SideBar />
        </section>
    )
}

export default Main
