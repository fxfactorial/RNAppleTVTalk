/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * ListViewGridLayoutExample from https://github.com/facebook/react-native
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  ListView,
  Platform,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} = ReactNative;

var THUMB_NAMES = [
  'like',
  'dislike',
  'call',
  'fist',
  'bandaged',
  'flowers',
  'heart',
  'liking',
  'party',
  'poke',
  'superlike',
  'victory',
];

var ListViewGridLayoutExample = React.createClass({

  statics: {
    title: '<ListView> - Grid Layout',
    description: 'Flexbox grid layout.'
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this._genRows({})),
    };
  },

  _pressData: ({}: {[key: number]: boolean}),

  componentWillMount: function() {
    this._pressData = {};
  },

  render: function() {
    return (
      // ListView wraps ScrollView and so takes on its properties.
      // With that in mind you can use the ScrollView's contentContainerStyle prop to style the items.
      <ListView
        removeClippedSubviews={this.props.removeClippedSubviews}
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        initialListSize={21}
        pageSize={3} // should be a multiple of the no. of visible cells per row
        scrollRenderAheadDistance={500}
        renderRow={this._renderRow}
      />
    );
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = THUMB_NAMES[rowHash % THUMB_NAMES.length];
    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)} underlayColor='transparent'>
        <View>
          <View style={styles.row}>
            <Image style={styles.thumb} source={{uri: imgSource}} />
            <Text style={styles.text}>
              {rowData}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
    var dataBlob = [];
    for (var ii = 0; ii < 100; ii++) {
      var pressedText = pressData[ii] ? ' (X)' : '';
      dataBlob.push('Cell ' + ii + pressedText);
    }
    return dataBlob;
  },

  _pressRow: function(rowID: number) {
    this._pressData[rowID] = !this._pressData[rowID];
    this.setState({dataSource: this.state.dataSource.cloneWithRows(
      this._genRows(this._pressData)
    )});
  },
});

/* eslint no-bitwise: 0 */
var hashCode = function(str) {
  var hash = 15;
  for (var ii = str.length - 1; ii >= 0; ii--) {
    hash = ((hash << 5) - hash) + str.charCodeAt(ii);
  }
  return hash;
};

var scale = Platform.isTVOS ? 2 : 1;

var styles = StyleSheet.create({
  list: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  row: {
    justifyContent: 'center',
    padding: scale*5,
    margin: scale*3,
    width: scale*100,
    height: scale*100,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: scale*1,
    borderRadius: scale*5,
    borderColor: '#CCC'
  },
  thumb: {
    width: scale*64,
    height: scale*64
  },
  text: {
    flex: 1,
    marginTop: scale*5,
    fontWeight: 'bold'
  },
});

module.exports = ListViewGridLayoutExample;
