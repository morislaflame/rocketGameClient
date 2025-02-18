import { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './routes';
import { MAIN_ROUTE } from './utils/consts';
import { Context } from './store/StoreProvider';


const AppRouter = () => {
    const { user } = useContext(Context);
    const [routes, setRoutes] = useState([]);

    return (
        <Routes>
            {user.isAuth && routes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} />
            ))}

            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}

            <Route path="*" element={<Navigate to={MAIN_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
