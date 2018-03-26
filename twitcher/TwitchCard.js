/**
 *  BSD 3-Clause License
 *
 * Copyright (c) 2018, Sidharth Mishra
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 * * Neither the name of the copyright holder nor the names of its
 *  contributors may be used to endorse or promote products derived from
 *  this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * TwitchCard.js
 * @author Sidharth Mishra
 * @description Twitcher's card component
 * @created Sat Mar 24 2018 22:08:41 GMT-0700 (PDT)
 * @last-modified Sun Mar 25 2018 22:54:02 GMT-0700 (PDT)
 */

import React from "react";
import { StyleSheet } from "react-native";
import { Card, Button, Text } from "react-native-elements";

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: "rgba(92, 99,216, 1)"
  },
  streamer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center"
  }
});

/**
 * A Twitch card. This component is responsible for displaying the streamer details:
 * 1/ Streamer name
 * 2/ Streamer image from Twitch
 * 3/ The watch now button.
 *
 * @export
 * @class TwitchCard
 * @extends {React.Component}
 */
export class TwitchCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.props = props;

    // console.log(`Card details = ${JSON.stringify(this.props, null, 4)}`);
  }

  render() {
    return (
      <Card title={this.props.title} image={{ uri: this.props.streamerImage }}>
        <Text style={styles.streamer}>{`${
          this.props.streamDetails.streamerName
        } is playing ${this.props.streamDetails.game} with ${
          this.props.streamDetails.viewers
        } viewers.`}</Text>
        <Button
          icon={{ name: "code" }}
          buttonStyle={styles.button}
          title="WATCH"
          onPress={() =>
            this.props.watchButtonHandler(this.props.streamDetails.streamURI)
          }
        />
      </Card>
    );
  }
}
