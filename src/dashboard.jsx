import React from 'react'
import Sidebar from './sidebar'
import { Outlet } from 'react-router';

export default function Dashboard() {
    return (
        <div style={{ display: 'flex'}}>
            <Sidebar></Sidebar>
            <Outlet></Outlet>
        </div>
    );
}