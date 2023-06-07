import React from 'react';

export default class CountDown extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            count: props.duration ? props.duration : 0,
        }
    }
    componentDidMount() {
        this.timer = setInterval( () => {
            let {count} = this.state;
            this.setState({
                count: count -1
            })
        }, 1000)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.count !== this.state.count && this.state.count === 0) {
            clearInterval(this.timer)
        }
    }

    secondsToDhms(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600*24));
        var h = Math.floor(seconds % (3600*24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        
        var dDisplay = d > 0 ? d + (d==1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? (h<10 ? "0"+h+":" : h+":") : "";
        var mDisplay = m > 0 ? (m<10 ? "0"+m+":" : m+":") : "";
        var sDisplay = s >= 0 ? (s<10 ? "0"+s : s) : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    render() {
        let{count} = this.state;
        return(
            <>
               {(count>0) ? this.secondsToDhms(count) : "Time over!"}
            </>
        )
            
    }
}