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
 * Twitcher.js
 * @author Sidharth Mishra
 * @description Twitcher app
 * @created Sat Mar 24 2018 22:04:02 GMT-0700 (PDT)
 * @last-modified Tue Mar 27 2018 00:37:16 GMT-0700 (PDT)
 */

import React from "react";
import { StyleSheet, FlatList, View, Text, WebView, Dimensions } from "react-native";
import { TwitchCard } from "./TwitchCard";
import { SearchBar, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

/** The localIP and localPort are the the IP and port for the locally running Golang server. */
const { localIP, localPort } = require("../app.json");

/** Styles for the components. */
const styles = StyleSheet.create({
  searchMode: {
    marginTop: 20,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#000000",
    alignContent: "center"
  },
  backButton: {
    flex: 1,
    height: 66,
    marginTop: 22,
    marginBottom: 22,
    backgroundColor: "rgba(92, 99,216, 1)",
    width: 300,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5,
    alignSelf: "center"
  },
  resultSet: {
    // marginTop: 20,
    flex: 2,
    marginBottom: 20
  },
  logo: {
    marginTop: 20,
    color: "rgba(92, 99,216, 1)",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24
  }
});

/** Twitcher is in the search mode, only the search box is visible. */
const SEARCH_MODE = Symbol();

/** Twitcher enters the watch stream mode when the user clicks on the Watch now button. */
const WATCH_STREAM_MODE = Symbol();

/**
 * Twitcher is the root component for this application.
 * @export
 * @class Twitcher
 * @extends {React.Component}
 */
export class Twitcher extends React.Component {
  constructor(props, context) {
    super(props, context);
    /** default state */
    this.state = {
      mode: SEARCH_MODE, //WATCH_STREAM_MODE,
      resultsPageNbr: 1,
      searchString: "",
      streams: [],
      streamURI: "",
      refreshing: false
    };

    // fetch the live streams, since this is the initial load event
    // bring in everything
    fetch(`http://${localIP}:${localPort}/getLiveCreators?pgNbr=1`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(body => {
        const streams = body;
        const newState = Object.assign({}, this.state); // clone
        newState.streams = streams;
        // console.log(`newState = ${JSON.stringify(newState)}`);
        this.setState(newState);
      })
      .catch(err => {
        console.log(`Error = ${err}`);
      });
  }

  /**
   * Changes twitcher to watch stream mode.
   * @param {string} streamURI The stream's URI.
   * @memberof Twitcher
   */
  watchStream(streamURI) {
    console.log(`Stream URI = ${streamURI}`);
    const newState = Object.assign({}, this.state);
    newState.mode = WATCH_STREAM_MODE;
    newState.refreshing = false;
    newState.streamURI = streamURI;
    this.setState(newState);
  }

  /**
   * Updates the search string.
   * @param {string} searchString The string to search Twitch streams with.
   * @memberof Twitcher
   */
  updateSearchString(searchString) {
    const newState = Object.assign({}, this.state);
    newState.searchString = searchString;
    this.setState(newState);
  }

  /**
   * Searches the active streams for the `searchString`.
   * @memberof Twitcher
   */
  searchStreams() {
    console.log(`searchString = ${JSON.stringify(this.state.searchString, null, 4)}`);
    fetch(
      `http://${localIP}:${localPort}/getLiveCreators?searchString=${encodeURIComponent(
        this.state.searchString
      )}&pgNbr=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(body => {
        const streams = body;
        const newState = Object.assign({}, this.state); // clone
        newState.resultsPageNbr = 1;
        newState.streams = streams;
        newState.refreshing = false;
        this.setState(newState);
      })
      .catch(err => {
        console.log(`Error = ${err}`);
      });
  }

  /**
   * Fetches the next page of results.
   * @param {{distanceFromEnd: number}} info Information about the trigger
   * @memberof Twitcher
   */
  fetchNextPage(info) {
    if (this.fetchingNextPage) {
      //   this.onEndReachedCalledDuringMomentum = true;
      return;
    }
    if (
      //   !this.onEndReachedCalledDuringMomentum &&
      this.state.streams.length > 5 &&
      !this.fetchingNextPage
    ) {
      this.fetchingNextPage = true; // flag indicating that the fetching has begun

      fetch(
        `http://${localIP}:${localPort}/getLiveCreators?searchString=${encodeURIComponent(
          this.state.searchString
        )}&pgNbr=${this.state.resultsPageNbr + 1}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => res.json())
        .then(body => {
          const streams = body;
          if (streams.length < 1) {
            // do nothing since there are no records in the incoming response
            console.log(`No results found.`);
            return;
          }
          const newState = Object.assign({}, this.state); // clone
          newState.streams = streams;
          newState.refreshing = false;
          newState.resultsPageNbr = this.state.resultsPageNbr + 1; // udpate the pgNbr
          this.setState(newState);
          if (this.flRef) this.flRef.scrollToOffset({ x: 0, y: 0, animated: false }); // scroll to top
          //   this.onEndReachedCalledDuringMomentum = true;
          this.fetchingNextPage = false; // flag updated to indicate that the fetching is done
        })
        .catch(err => {
          console.log(`Error = ${err}`);
          //   this.onEndReachedCalledDuringMomentum = true;
          this.fetchingNextPage = false; // flag updated to indicate that the fetching is done
        });
    }
  }

  /**
   * Fetches the prev page Seamless scrolling?
   * @memberof Twitcher
   */
  fetchPrevPage() {
    if (this.fetchingPrevPage) return;
    if (this.state.resultsPageNbr > 1 && !this.fetchingPrevPage) {
      const newState = Object.assign({}, this.state); // clone
      newState.refreshing = true;
      this.setState(newState);

      this.fetchingPrevPage = true; // flag indicates that it is fetching the prev records

      fetch(
        `http://${localIP}:${localPort}/getLiveCreators?searchString=${encodeURIComponent(
          this.state.searchString
        )}&pgNbr=${this.state.resultsPageNbr - 1}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => res.json())
        .then(body => {
          const streams = body;
          const newState = Object.assign({}, this.state); // clone
          newState.streams = streams;
          newState.refreshing = false;
          newState.resultsPageNbr = this.state.resultsPageNbr - 1;
          this.setState(newState);
          if (this.flRef) this.flRef.scrollToOffset({ x: 0, y: 0, animated: false }); // scroll to top
          this.fetchingPrevPage = false; // flag indicates that fetching is complete
        })
        .catch(err => {
          console.log(`Error = ${err}`);
          this.fetchingPrevPage = false; // flag indicates that fetching is complete
        });
    }
  }

  render() {
    console.log(`pgNbr = ${JSON.stringify(this.state.resultsPageNbr, null, 4)}`);
    switch (this.state.mode) {
      case SEARCH_MODE: {
        //
        // Search and display the streamer cards
        //

        //
        // Results of the search
        //
        const results = (
          <FlatList
            ref={ref => {
              this.flRef = ref;
            }} // set flatlist ref inside this.flRef
            //#region props for controlling flatlist's re-rendering
            // extraData={this.state.streams}
            // initialScrollIndex={0}
            //#endregion props for controlling flatlist's re-rendering
            style={styles.resultSet}
            data={this.state.streams}
            keyExtractor={stream => {
              // console.log(`Key extr stream = ${JSON.stringify(stream, null, 4)}`);
              return stream._id;
            }}
            renderItem={({ item }) => {
              // console.log(`Rendering stream = ${JSON.stringify(item, null, 4)}`);
              return (
                <TwitchCard
                  key={item._id}
                  title={item.title}
                  streamerImage={item.thumbnailURI}
                  streamDetails={item}
                  watchButtonHandler={this.watchStream.bind(this)}
                />
              );
            }}
            onEndReachedThreshold={0}
            onEndReached={this.fetchNextPage.bind(this)}
            refreshing={this.state.refreshing}
            onRefresh={this.fetchPrevPage.bind(this)}
            // momentum -- still buggy and not clear from docs
            // onMomentumScrollBegin={() => {
            //   this.onEndReachedCalledDuringMomentum = false;
            // }}
          />
        );

        //
        // No active streams found
        //
        const noStreams = (
          <Text style={{ alignContent: "center", color: "#ffffff" }}>
            {"No streams turned up for the search term!"}
          </Text>
        );

        return (
          <View style={styles.searchMode}>
            <Text style={styles.logo}>Twitcher</Text>
            <SearchBar
              showLoading={true}
              placeholder={
                this.state.searchString.length === 0
                  ? "Search active streams..."
                  : this.state.searchString
              }
              onChangeText={this.updateSearchString.bind(this)}
              onSubmitEditing={this.searchStreams.bind(this)}
            />
            {this.state.streams.length > 0 ? results : results}
          </View>
        );
      }

      case WATCH_STREAM_MODE: {
        console.log(`window = ${JSON.stringify(Dimensions.get("window"))}`);
        console.log(`screen = ${JSON.stringify(Dimensions.get("screen"))}`);

        //
        // Embed the live stream video, chat, everything!
        // src :: https://dev.twitch.tv/docs/embed/
        //
        return (
          <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <WebView
              source={{
                html: `<html>
                        <body>
                            <!-- Add a placeholder for the Twitch embed -->
                            <div id="twitch-embed"></div>
                        
                            <!-- Load the Twitch embed script -->
                            <script src="https://embed.twitch.tv/embed/v1.js"></script>
                        
                            <!-- Create a Twitch.Embed object that will render within the "twitch-embed" root element. -->
                            <script type="text/javascript">
                                // alert(\`${this.state.streamURI.split("/").pop()}\`)
                                // alert(\`${Dimensions.get("window").width}\`);
                                // alert(\`${Dimensions.get("window").height}\`);
                                
                                new Twitch.Embed("twitch-embed", {
                                    width: "100%", /* \`${
                                      Dimensions.get("window").width
                                    }\`,*/
                                    height: "100%", /* \`${
                                      Dimensions.get("window").height
                                    }\`, */
                                    channel: "${this.state.streamURI.split("/").pop()}",
                                    theme: "dark"
                                });

                                embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                                    var player = embed.getPlayer();
                                    player.play();
                                });
                            </script>
                        </body>
                </html>`
              }} // {{ uri: this.state.streamURI }} // the URI was getting Twitch header, the embedding is a better approach
              style={{ marginTop: 20, flex: 2, backgroundColor: "#000000" }}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
            />
            <Button
              backgroundColor="#03A9F4"
              buttonStyle={styles.backButton}
              title="Back to search"
              onPress={(() => {
                const newState = Object.assign({}, this.state);
                newState.mode = SEARCH_MODE;
                newState.refreshing = false;
                this.setState(newState);
              }).bind(this)}
            />
          </View>
        );
      }
    }
  }
}
