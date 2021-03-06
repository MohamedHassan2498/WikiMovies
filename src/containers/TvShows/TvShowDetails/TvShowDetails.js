import React, { Component } from "react";
import { Container, Grid, Image, Icon, Modal } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SliderMedia from "react-slick";
import axios from "axios";
import ISO6391 from "iso-639-1";
import NoImage from "../../../assets/NoImage.png";
import Slider from "../../../components/Slider/Slider";
import "./TvShowDetails.css";

class TvShowDetails extends Component {
  state = {
    tvShowGenres: [],
    tvshowCasts: [],
    tvshowMedias: [],
    tvshowRecommends: [],
    clickPlayTrailer: false,
    redirect: null,
  };
  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/tv/${this.props.match.params.id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
      )
      .then((response) => {
        this.setState({
          coverPhoto: `${process.env.REACT_APP_ORIGINAL_IMAGE_URL}${response.data.backdrop_path}`,
          tvshowGenres: response.data.genres.map((tvshowGenre) => ({
            key: tvshowGenre.id,
            genre: tvshowGenre.name,
          })),
          tvshowHomepage: response.data.homepage,
          tvshowName: response.data.name,
          mainPhoto: response.data.poster_path
            ? `${process.env.REACT_APP_ORIGINAL_IMAGE_URL}${response.data.poster_path}`
            : NoImage,
          tvshowReleaseDate: response.data.first_air_date,
          tvshowRuntime: response.data.episode_run_time.join(" / "),
          tvshowNetwork: response.data.networks[0].logo_path,
          tvshowOverview: response.data.overview,
          tvshowOriginalLanguage: response.data.original_language,
          tvshowStatus: response.data.status,
          numberOfSeasons: response.data.seasons,
        });
      })
      .catch((error) => this.setState({ redirect: "/page404" }));
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/tv/${this.props.match.params.id}/credits?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`
      )
      .then((response) => {
        this.setState({
          tvshowCasts: response.data.cast.map((tvshowCast) => ({
            key: tvshowCast.id,
            actorName: tvshowCast.name,
            characterName: tvshowCast.character,
            actorImage: tvshowCast.profile_path
              ? `${process.env.REACT_APP_BASE_IMAGE_URL}/${tvshowCast.profile_path}`
              : NoImage,
          })),
        });
      });
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/tv/${this.props.match.params.id}/external_ids?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`
      )
      .then((response) => {
        this.setState({
          tvshowFacebook: response.data.facebook_id,
          tvshowInstagram: response.data.instagram_id,
          tvshowTwitter: response.data.twitter_id,
        });
      });
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/tv/${this.props.match.params.id}/videos?language=en-US&api_key=${process.env.REACT_APP_API_KEY}`
      )
      .then((response) => {
        this.setState({
          tvshowTrailer: response.data.results[0]
            ? response.data.results[0].key
            : null,
          tvshowTrailerId: response.data.results[0]
            ? response.data.results[0].id
            : null,
          tvshowMedias: response.data.results.map((tvshowMedia) => ({
            key: tvshowMedia.key,
            id: tvshowMedia.id,
          })),
        });
      });
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/tv/${this.props.match.params.id}/recommendations?language=en-US&api_key=${process.env.REACT_APP_API_KEY}&page=1`
      )
      .then((response) => {
        this.setState({
          tvshowRecommends: response.data.results.map((tvshowRecommend) => ({
            key: tvshowRecommend.id,
            recommendedTvShowName: tvshowRecommend.name,
            recommendedTvShowDate: tvshowRecommend.first_air_date,
            recommendedTvShowImage: tvshowRecommend.poster_path
              ? `${process.env.REACT_APP_BASE_IMAGE_URL}/${tvshowRecommend.poster_path}`
              : NoImage,
          })),
        });
      });
  }
  render() {
    const {
      coverPhoto,
      mainPhoto,
      tvshowName,
      tvshowReleaseDate,
      tvshowGenres,
      tvshowRuntime,
      tvshowTrailer,
      tvshowMedias,
      tvshowTrailerId,
      tvshowOverview,
      tvshowCasts,
      tvshowFacebook,
      tvshowInstagram,
      tvshowTwitter,
      tvshowHomepage,
      tvshowStatus,
      tvshowNetwork,
      tvshowOriginalLanguage,
      tvshowRecommends,
      numberOfSeasons,
      redirect,
    } = this.state;
    if (redirect) {
      return <Redirect to={redirect} />;
    }
    const settingss = {
      initialSlide: 0,
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
    };
    return (
      <Container className="TvShowDetailsContainerStyle">
        <Grid>
          <Grid.Row
            style={{
              backgroundImage: `linear-gradient(
                                to right,
                                rgba(100, 100, 100, 1),
                                rgba(100, 100, 100, 0.5)
                                ),
                                url("${coverPhoto}")`,
              backgroundSize: "100% 100%",
            }}
          >
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={4}
              className="TvShowDetailsLeftCol"
            >
              <Image className="TvShowDetailsMainPhotoStyle" src={mainPhoto} />
            </Grid.Column>
            <Grid.Column
              className="TvShowDetailsGridColumnInfo TvShowDetailsRightCol"
              mobile={16}
              tablet={16}
              computer={12}
            >
              <h2 className="TvShowDetailsTvShowName">{tvshowName}</h2>
              <p className="TvShowDetailsTvShowInfoP">{tvshowReleaseDate}</p>
              {tvshowGenres &&
                tvshowGenres.map((tvshowGenre) => (
                  <span className="TvShowDetailsTvShowInfoSpan">
                    {tvshowGenre.genre + "."}
                  </span>
                ))}
              <span className="TvShowDetailsTvShowInfoSpan">
                {numberOfSeasons && numberOfSeasons.length} Season(s).
              </span>
              <span className="TvShowDetailsTvShowInfoSpan">
                {tvshowRuntime ? `${tvshowRuntime} Minutes.` : null}
              </span>
              <div className="TvShowDetailsModalDiv">
                {tvshowTrailer ? (
                  <Modal
                    closeIcon
                    trigger={
                      <button className="TvShowDetailsPlayTrailerButton">
                        <Icon name="play" />
                        Play Trailer
                      </button>
                    }
                  >
                    <Modal.Content className="TvShowDetailsModalContent">
                      <iframe
                        className="TvShowDetailsIframeStyle"
                        src={`https://www.youtube.com/embed/${tvshowTrailer}`}
                        title={tvshowTrailerId}
                      ></iframe>
                    </Modal.Content>
                  </Modal>
                ) : null}
              </div>
              {tvshowOverview ? (
                <>
                  <h3 className="TvShowDetailsOverviewHeader">Overview</h3>
                  <p className="TvShowDetailsTvShowInfoP">{tvshowOverview}</p>
                </>
              ) : null}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={12}
              className="TvShowDetailsLeftCol"
            >
              <h1 className="TvShowDetailsFullCast">Full Cast</h1>
              {tvshowCasts[0] ? (
                <Slider mainDatas={tvshowCasts} hrefMainUrl={"/person/"} />
              ) : (
                <h3>No Cast crew found</h3>
              )}
            </Grid.Column>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={4}
              className="TvShowDetailsRightCol"
            >
              <div className="TvShowDetailsExternalIconsDiv">
                {tvshowFacebook ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.facebook.com/${tvshowFacebook}`}
                  >
                    <Icon size="big" name="facebook" />
                  </a>
                ) : null}
                {tvshowInstagram ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.instagram.com/${tvshowInstagram}`}
                  >
                    <Icon size="big" name="instagram" />
                  </a>
                ) : null}
                {tvshowTwitter ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.twitter.com/${tvshowTwitter}`}
                  >
                    <Icon size="big" name="twitter" />
                  </a>
                ) : null}
                {tvshowHomepage ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={tvshowHomepage}
                  >
                    <Icon size="big" name="linkify" />
                  </a>
                ) : null}
              </div>
              <div>
                <p className="TvShowDetailsTvShowInfoP">
                  <strong className="TvShowDetailsStrong">Status</strong>
                  {tvshowStatus ? tvshowStatus : "-"}
                </p>
                <p className="TvShowDetailsTvShowInfoP">
                  <strong className="TvShowDetailsStrong">Network</strong>
                  {tvshowNetwork ? (
                    <Image
                      className="TvShowDetailsNetworkImage"
                      src={`${process.env.REACT_APP_BASE_IMAGE_URL}${tvshowNetwork}`}
                    />
                  ) : (
                    "-"
                  )}
                </p>
                <p className="TvShowDetailsTvShowInfoP">
                  <strong className="TvShowDetailsStrong">
                    Original Language
                  </strong>
                  {tvshowOriginalLanguage
                    ? ISO6391.getName(tvshowOriginalLanguage)
                    : "-"}
                </p>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="TvShowDetailsRow">
            <Grid.Column className="TvShowDetailsColumn">
              <h1>Media</h1>
              {tvshowMedias[0] ? (
                <SliderMedia {...settingss}>
                  {tvshowMedias &&
                    tvshowMedias.map((tvshowMedia) => (
                      <div>
                        <iframe
                          className="TvShowDetailsIframeStyle"
                          src={`https://www.youtube.com/embed/${tvshowMedia.key}`}
                          title={tvshowMedia.id}
                        ></iframe>
                      </div>
                    ))}
                </SliderMedia>
              ) : (
                <h3>No Medias found</h3>
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="TvShowDetailsRow">
            <Grid.Column className="TvShowDetailsColumn">
              <h1>Recommendations</h1>
              {tvshowRecommends[0] ? (
                <Slider
                  mainDatas={tvshowRecommends}
                  hrefMainUrl={"/tvshowdetails/"}
                />
              ) : (
                <h3>No Recommendations found</h3>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
export default TvShowDetails;
