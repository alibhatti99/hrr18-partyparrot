import React from 'react';
import Request from 'superagent';
import Event from './Event';
import NavBar from './NavBar';

export default class CreateEvent extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      event: [],
      selectedEvent: {},
      submitted: ""
    }
  }


//add start date, end date
  render () {
    var events = this.state.events.map(eventEntry => {
        return (
          <li style={{"marginTop":"20px"}} onClick={ () => this.selectEvent(eventEntry) }>
            <img src={eventEntry.logo ? eventEntry.logo.url : "http://130.211.52.161/tradeo-content/themes/nucleare-pro/images/no-image-box.png"} style={{"width":"100px", 'marginRight':'10px', "borderRadius":'5px'}} alt="" />
            <a>{eventEntry.name.html}</a>
            <p>{eventEntry.venue.address.localized_address_display}</p>
            <p>Start Date: {eventEntry.start.local} {eventEntry.start.timezone}</p>
            <p>End Date: {eventEntry.end.local} {eventEntry.end.timezone}</p>
          </li>
        )
    });

    //Replace the part below with NavBar to save some space on the page

    // <div className="view hm-black-light">
    //     <img src="img/pattern.png" alt=""/>
    //     <div className="mask flex-center">
    //       <h1 className="white-text h1-responsive">Create Your Event</h1>
    //     </div>
    //   </div>

    if(!this.state.submitted){
    return (
      <div className='create-event'>

        <NavBar />
        <h1 className="white-text h1-responsive">Create Your Event</h1>
        <div className="wide text-md-center" style={{"marginTop":"70px"}}>
          <h2 className="h2-responsive">Search Your Event On Eventbrite</h2>
          <div className="row margin-top">
            <h3 className="h3-responsive">By Name</h3>
            <hr />
            <form style={{ 'width':'100%' }}>
              <input className="inputEventInfo" placeholder="Event Keyword..." ref ={ (input) => this.searchByName = input } />
              <input className="inputEventInfo" placeholder="Event City..." style={{ 'borderLeft':'none' }} ref ={ (input) => this.searchByCity = input } />
              <input className="inputEventInfoDate" type="date" placeholder="Event Start Date" ref ={ (input) => this.searchByStartDate = input } />
              <input className="inputEventInfoDate" type="date" placeholder="Event End Date" ref ={ (input) => this.searchByEndDate = input } />
              <button className="searchBtn" type='button' onClick = { () => this.search(this.searchByName.value, this.searchByCity.value, this.searchByStartDate.value, this.searchByEndDate.value) }><i className="material-icons" style={{"marginTop":"3px", "color":"#666"}}>search</i></button>
            </form>
            <div className="col-xs-12">
              <hr />
              <h2 className="h2-responsive">Select Your Event</h2>
              <input className="inputId" style={{ 'width':'75%' }} placeholder="Selected Event..." value={this.state.selectedEvent.name ? this.state.selectedEvent.name.html : ""} readOnly="true" ref="eventName"/>
              <div className="scrollBox margin-top text-xs-left">
                <ul>
                  {events}
                </ul>
              </div>
            </div>
            <div className="col-xs-12">
              <hr />
              <h2 className="h2-responsive">Prizes</h2>

              <img style={{ "width":"90px", 'borderRight':'1px solid rgba(0,0,0,.1)', 'padding':'20px' }} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-gold_2x.png" alt="" />
              <input className="inputEventInfo" placeholder="Points to earn.." style={{ 'margin':"25px" }} ref ={ (input) => this.gPoint = input } />
              <input className="inputEventInfo" placeholder="Reward..." style={{ 'marginTop':"25px" }} ref ={ (input) => this.gReward = input }/>
              <div />
              <img style={{ "width":"90px", 'borderRight':'1px solid rgba(0,0,0,.1)', 'padding':'20px' }} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-silver_2x.png" alt="" />
              <input className="inputEventInfo" placeholder="Points to earn.." style={{ 'margin':"25px" }} ref ={ (input) => this.sPoint = input }/>
              <input className="inputEventInfo" placeholder="Reward..." style={{ 'marginTop':"25px" }} ref ={ (input) => this.sReward = input }/>
              <div />
              <img style={{ "width":"90px", 'borderRight':'1px solid rgba(0,0,0,.1)', 'padding':'20px' }} src="http://ssl.gstatic.com/onebox/sports/olympics/2016/medals2/ic_medal-large-bronze_2x.png" alt="" />
              <input className="inputEventInfo" placeholder="Points to earn.." style={{ 'margin':"25px" }} ref ={ (input) => this.bPoint = input }/>
              <input className="inputEventInfo" placeholder="Reward..." style={{ 'marginTop':"25px" }} ref ={ (input) => this.bReward = input }/>
            </div>
            <div className="col-xs-12">
              <hr />
              <h2 className="h2-responsive">Post your Event</h2>
              <button className="btn btn-lg btn-default waves-effect waves-light" onClick={() => this.handleSubmit({
                gPoint: this.gPoint.value,
                gReward: this.gReward.value,
                sPoint: this.sPoint.value,
                sReward: this.sReward.value,
                bPoint: this.bPoint.value,
                bReward: this.bReward.value,
                event: this.state.selectedEvent
              })}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      )
    } else {
      return (
        <div>
          <Event
            selectedEvent = {this.state.selectedEvent}
            gPoint = {this.gPoint.value}
            gReward = {this.gReward.value}
            sPoint = {this.sPoint.value}
            sReward = {this.sReward.value}
            bPoint = {this.bPoint.value}
            bReward = {this.bReward.value} />
        </div>
      )
    }
  }


  clearForm() {
    this.gPoint.value = "";
    this.gReward.value = "";
    this.sPoint.value = "";
    this.sReward.value = "";
    this.bPoint.value = "";
    this.bReward.value = "";
    this.state.selectedEvent = {};
  }

  handleSubmit(eventObj) {
    $.ajax({
      url: '/create',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(eventObj),
      success: (data) => {
        this.setState({data: data});
        this.setState({submitted: "submitted"});
      },
      error: (xhr, status, err) => {
        this.clearForm();
      }
    });
  }

  search(query, city, startDate, endDate){
    var s = startDate + 'T00:00:00Z';
    var e = endDate + 'T00:00:00Z';
    console.log('eventbrite date', s, e);
    var url = `https://www.eventbriteapi.com/v3/events/search/?q=${query}&sort_by=best&location.address=${city}&start_date.range_start=${s}&start_date.range_end=${e}&expand=venue&token=YZO3HZ5MJZYKY6QU64H2`;
    Request.get(url).then((response) => {
      console.log('Everbrite', response.body.events);
      this.setState({
        events: response.body.events
      });
    });
  }

  searchId(id){
    var url = `https://www.eventbriteapi.com/v3/events/${id}/?token=YZO3HZ5MJZYKY6QU64H2`;
    Request.get(url).then((response) => {
      this.setState({
        event: response.body
      });
    });
  }

  selectEvent(eventEntry) {
    this.setState({
      selectedEvent: eventEntry
    });
  }
}