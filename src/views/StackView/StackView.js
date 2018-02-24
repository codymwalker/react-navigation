import * as React from 'react';
import { NativeModules } from 'react-native';

import StackViewLayout from './StackViewLayout';
import Transitioner from '../Transitioner';
import NavigationActions from '../../NavigationActions';
import TransitionConfigs from './StackViewTransitionConfigs';

const NativeAnimatedModule =
  NativeModules && NativeModules.NativeAnimatedModule;

class StackView extends React.Component {
  static defaultProps = {
    navigationConfig: {
      mode: 'card',
    },
  };

  render() {
    return (
      <Transitioner
        render={this._render}
        configureTransition={this._configureTransition}
        navigation={this.props.navigation}
        descriptors={this.props.descriptors}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={(transition, lastTransition) => {
          const { onTransitionEnd, navigation } = this.props;
          navigation.dispatch(
            NavigationActions.completeTransition({
              key: this.props.navigation.state.key,
              routeKey: transition.scene.route.key,
            })
          );
          onTransitionEnd && onTransitionEnd(transition, lastTransition);
        }}
      />
    );
  }

  _configureTransition = (transitionProps, prevTransitionProps) => {
    return {
      ...TransitionConfigs.getTransitionConfig(
        this.props.navigationConfig.transitionConfig,
        transitionProps,
        prevTransitionProps,
        this.props.navigationConfig.mode === 'modal'
      ).transitionSpec,
      useNativeDriver: !!NativeAnimatedModule,
    };
  };

  _render = (transitionProps, prevTransitionProps) => {
    const { screenProps, navigationConfig } = this.props;
    return (
      <StackViewLayout
        {...navigationConfig}
        transitionProps={transitionProps}
        prevTransitionProps={prevTransitionProps}
        screenProps={screenProps}
        descriptors={this.props.descriptors}
      />
    );
  };
}

export default StackView;
