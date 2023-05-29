import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { AppState, AppStateStatus, Platform, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import uuid from 'react-native-uuid';
import { Provider } from 'react-redux';
import * as Routes from './src/constants/routes';
import WebsocketModule from './src/modules/Websocket.module';
import ConnnectionModule from './src/modules/Connection.module';
import Router from './src/navigation/Router';
import store from './src/redux/store';
import { handleDeepLink, navigationRef } from './src/services/NavigationService';
import Websocket from './src/services/Websocket';
import { checkAndroidPermissionsMultiple } from './src/utils/androidPermissionsHelper';

const App: React.FC = () => {
  const routeNameRef = React.useRef<string>();
  let sessionId = null;

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    // Websocket.connect();
    if (Platform.OS === 'android') {
      checkAndroidPermissionsMultiple();
    }
    AppState.addEventListener('change', handleAppStateChange);
    const unsubscribe = dynamicLinks().onLink(handleDeepLink);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      unsubscribe();
      Websocket.disconnect();
    };
  }, []);

  const handleAppStateChange = (appState: AppStateStatus) => {
    switch (appState) {
      case 'active': {
        // Websocket.connect();
        sessionId = uuid.v4();
        analytics().logEvent('app_opened', { session_id: sessionId });
        return;
      }
      case 'inactive':
      case 'background':
        // Websocket.disconnect();
        if (sessionId) {
          analytics().logEvent('app_closed', { session_id: sessionId });
        }
        sessionId = null;
    }
  };

  const statusBarStyle = Platform.OS === 'ios' ? 'dark-content' : 'default';

  return (
    <Provider store={store}>
      <ConnnectionModule />
      <StatusBar barStyle={statusBarStyle} />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <Router initialRoute={Routes.Splash} />
      </NavigationContainer>
      <WebsocketModule />
    </Provider>
  );
};
export default App;
