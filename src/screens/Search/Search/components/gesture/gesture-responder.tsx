import React, { FC, useRef } from 'react';
import { PanResponder, View } from 'react-native';
import type { TouchPoint } from '../types';
import type { IGestureProps } from './types';

const GestureHandler: FC<IGestureProps> = ({
  onEndTouchEvents,
  onStartTouchEvents,
  onChangeTouchEvents,
}) => {
  const pathRef = useRef<TouchPoint[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: (e, gestureState) => {
      pathRef.current = [];
      if (gestureState.numberActiveTouches > 1) return;
      onStartTouchEvents?.(e, gestureState);
    },
    onPanResponderMove: (event, move) => {
      if (move.numberActiveTouches > 1) return;
      pathRef.current.push({
        x: event.nativeEvent.locationX,
        y: event.nativeEvent.locationY,
      });
      onChangeTouchEvents?.([...pathRef.current]);
    },
    onPanResponderRelease: () => {
      const points = [...pathRef.current];
      onChangeTouchEvents(points);

      onEndTouchEvents?.(points);
    },
  });

  // @ts-ignore
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      {...panResponder.panHandlers}
    />
  );
};

export default GestureHandler;
