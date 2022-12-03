import {Route} from 'react-router-dom';

import {ROUTES} from '../../app/config/routes'

const Routes = () => {
  return (
    <>
    {ROUTES.map(route => <Route key={route.name} path={route.route} component={route.component} />)}
    </>
  )
}

export default Routes