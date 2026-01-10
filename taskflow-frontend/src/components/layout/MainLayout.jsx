import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                backgroundColor: 'var(--color-background)',
                minHeight: '100vh'
            }}>
                <Outlet />
            </main>
        </div>
    );
};
