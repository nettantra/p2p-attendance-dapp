pragma solidity ^0.4.2;

contract RegisteredAttendance {

	struct attendanceregister {
        
		Address public presentmarker;
		Address public absentmarker;
		string opinion
	}

	function markpresent (uint _attendeeId) public {
        // require that they haven't voted before
        //require(!attendancetakers[msg.sender]);

        // require a valid attendee
        require(_attendeeId > 0 && _attendeeId <= attendeesCount);

        // record that an employee has marked an attendee as present
        attendancetakers[msg.sender] = true;
        presentmarker = attendancetakers[msg.sender]

        // update attendee present Count
        attendees[_attendeeId].present ++;

        // trigger voted event
        markedEvent(_attendeeId);



}

        function markabsent (uint _attendeeId) public {
        // require that they haven't voted before
        //require(!attendancetakers[msg.sender]);

        // require a valid attendee
        require(_attendeeId > 0 && _attendeeId <= attendeesCount);

        // record that an employee has marked an attendee as absent
        attendancetakers[msg.sender] = true;
        absentmarker = attendancetakers[msg.sender]

        // update attendee vote Count
        attendees[_attendeeId].absent ++;

        // trigger voted event
        markedEvent(_attendeeId);
    }






	function registeredAttendance(uint _attendeeId) public return (opinion) {
		if (presentmarker = attendancetakers[msg.sender])
		opinion = "present"

		else 
		opinion = "absent"

		}








}

