import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {randomize, averageData} from './utils/helpers';

const WIDTH = Dimensions.get('window').width;
const API_URL = 'https://www.cambiocup.com/api';
const MALACHITE = '#53dd6c';
const CRIMSON = '#d7263d';

function App(): JSX.Element {
  const [coin, setCoin] = useState('CUP');
  const [data, setData] = useState({
    value: 0,
    average: 0,
    isLoading: true,
    error: null,
  });

  // useEffect to retrieve the value of the selected coin [CUP, MLC] and the value of the coin
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        const coinData = coin === 'CUP' ? json.cupHistory : json.mlcHistory;
        const {first, average} = averageData(coinData);
        const value = parseFloat(
          Number.parseFloat(randomize(first.value, 0.5).toString()).toFixed(
            coin === 'CUP' ? 2 : 4,
          ),
        );
        setData({value, average, isLoading: false, error: null});
      } catch (error) {
        setData({...data, isLoading: false, error: error.message});
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [coin]);

  const bgColor = data.value < data.average ? MALACHITE : CRIMSON;

  if (data.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (data.error) {
    return <Text>Error: {data.error}</Text>;
  }

  return (
    <SafeAreaView style={[styles.safearea, {backgroundColor: bgColor}]}>
      <StatusBar barStyle={'light-content'} />
      <View style={[styles.container, {backgroundColor: bgColor}]}>
        <Text style={[styles.centerText, styles.h1]}>
          Tasa de cambio en Cuba
        </Text>

        <View style={styles.infoSection}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.coinName}>CUP</Text>
            <Text style={styles.coinName}>MLC</Text>
          </View>

          <Text style={styles.coinValue}>${data.value}</Text>
        </View>

        <Text style={[styles.centerText, styles.h2]}>
          Un servicio gratuito de QvaPay
        </Text>
        <Text style={[styles.centerText, styles.h2]}>
          Todos los derechos reservados
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  infoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Barlow-Regular',
  },
  h2: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Barlow-Regular',
  },
  centerText: {
    textAlign: 'center',
  },
  coinName: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: 'Barlow-Bold',
  },
  coinValue: {
    fontSize: WIDTH / 4.5,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Barlow-Black',
  },
  coinRow: {
    flexDirection: 'row',
  },
});

export default App;
