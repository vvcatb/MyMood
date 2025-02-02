import React, {Component} from 'react';
import { Dimensions, Animated, Image, StyleSheet, Text, View } from 'react-native'
import MyBar from '../components/MyBarH'

export default class Mood extends Component {
  constructor(props){
    super(props)
    this.state = {
      hightlineChild: null,
      name: props.name,
      moods: props.moods,
      opacityAnim: new Animated.Value(0)
    }
  }

  componentDidMount() {
    const { opacityAnim } = this.state
    Animated.timing(
      opacityAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }
    ).start()
  }

  _onPress(cancelFunc, key) {
    if(this.state.hightlineChild && this.state.hightlineChild.key && key !== this.state.hightlineChild.key){
      this.state.hightlineChild.cancelFunc(false)
    }
    this.state.hightlineChild = {
      cancelFunc,
      key
    }
    // if(this.state.hightlineChild){
    //   this.state.hightlineChild._cancelPress()
    // }
    // this.state.hightlineChild = ref
  }
  getAvePoint () {
    if(!Array.isArray(this.state.moods))return 0
    const legalMap = this.state.moods.filter(item => typeof item === 'number')
    if(legalMap.length === 0)return 0
    return legalMap.reduce((total, current) => total + current, 0) / legalMap.length
  }
  render() {
    const { name, moods, opacityAnim } = this.state
    const bars = Array.from({length: 7}).map((item, i)=> {
      let key = 'bar' + i
      let current = moods[i]
      current = typeof current === 'number' ? current > 100 ? 100 : current < 0 ? 0 : current : undefined
      return <MyBar key={key} value={current} barIdx={i}
        onPress={(cancelFunc) => this._onPress(cancelFunc, key)}
        ></MyBar>
    })
    const avePoint = this.getAvePoint().toFixed(0)
    return (
      <Animated.View style={{position: 'relative',opacity: opacityAnim}}>
        <View style={styles.Mood}>
          <View style={styles.detailBlock}>
            <Image source={require('../assets/eyes.jpg')} style={styles.avatarImg}></Image>
            <Text>{name}</Text>
          </View>
          <Text style={{ fontSize: 50, fontWeight: 'bold' }}>{avePoint}</Text>
          <Text style={{ color: 'rgb(146,146,146)' }}>周平均心情指数</Text>
          <View style={styles.barsContainer}>
            {bars}
            <View style={styles.midLine}></View>
          </View>
        </View>
        <Animated.View style={[styles.shadowMask,{opacity: opacityAnim}]}></Animated.View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  Mood: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    elevation: 30,
    shadowColor: 'transparent',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
    position: 'relative',
    marginTop: 10,
  },
  shadowMask: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 80,
    elevation: 15,
    top: 10,
    left: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: Dimensions.get('window').width - 20,
  },
  barsContainer: {
    height: 220,
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 40,
    borderTopColor: 'rgb(242,242,242)',
    borderTopWidth: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    
  },
  midLine: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    height: 1,
    backgroundColor: 'rgb(242,242,242)',
    zIndex: -1
  },
  avatarImg: {
    height: 36,
    width: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    marginRight: 10
  },
  detailBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }
})
