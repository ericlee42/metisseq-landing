import BasicLayout from '@/layouts';
import { useEffect } from 'react';
import { createHashRouter, Link, RouterProvider, useNavigate } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '/',
    element: <BasicLayout />,
    hydrateFallbackElement: <p>Loading...</p>,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/Home'),
      },
    ],
  },
  {
    path: '/home',
    element: <BasicLayout />,
    hydrateFallbackElement: <p>Loading...</p>,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/Home'),
      },
    ],
  },
  {
    path: '/sequencers',
    element: <BasicLayout />,
    hydrateFallbackElement: <p>Loading...</p>,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/Sequencer'),
      },
    ],
  },
  {
    path: '/becomeSequencer',
    element: <BasicLayout />,
    hydrateFallbackElement: <p>Loading...</p>,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/BecomeSequencer'),
      },
    ],
  },
  {
    path: '/sequencers/:id',
    element: <BasicLayout />,
    hydrateFallbackElement: <p>Loading...</p>,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/SequencerDetail'),
      },
    ],
  },

  {
    path: '*',
    element: <NoMatch />,
  },
]);

function NoMatch() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home');
  }, []);

  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
