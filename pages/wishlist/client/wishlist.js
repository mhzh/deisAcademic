Template.wishlist.onCreated(function() {
    this.wishlistDict = new ReactiveDict();
    this.wishlistDict.set("dataReady", false);
})

Template.wishlist.helpers({
    settings: function() {
        const dict = Template.instance().wishlistDict;
        return {
            rowsPerPage: 10,
            showFilter: false,
            showNavigationRowsPerPage: false,
            multiColumnSort: false,
            fields: [
                { key: 'index', hidden: true },
                { key: 'courseName', label: 'Course', sortable: false }, {
                    key: 'code',
                    label: 'Code',
                    headerClass: "three wide",
                    sortable: false,
                    fn: function(key, obj) {
                        const sectionNum = obj.section;
                        return key + "-" + sectionNum;
                    }
                },
                { key: 'termName', label: 'Term', sortable: false }, {
                    key: 'req',
                    label: 'Requirements',
                    sortable: false,
                    fn: function(key) {
                        if (key.length != 0) {
                            let result = "";
                            for (let req of key) {
                                result = result + req + " ";
                            };
                            return result;
                        } else {
                            return "/";
                        }
                    }
                }, {
                    key: 'instructorNames',
                    label: 'Instructors',
                    sortable: false,
                    fn: function(key, obj) {
                        let result = "";
                        result = result + key[0];
                        for (let i = 1; i < key.length; i++) {
                            result = result + "\n" + key[i];
                        };

                        if (!result) {
                            return "/"
                        } else {
                            return result;
                        }
                    }
                }, {
                    key: 'enrolled',
                    label: 'Enrolled',
                    sortable: false,
                    fn: function(key, object) {
                        var limit = object.limit;
                        if (!limit) {
                            limit = 999;
                        };

                        return key + "/" + limit; //shows enrollment as enrolled/limit
                    }
                },
                { key: 'status_text', label: 'Status', sortable: false }, {
                    key: 'times',
                    label: 'Times',
                    sortable: false,
                    fn: function(key) {
                        var result = "";
                        for (var item of key) {
                            //get days
                            days = "";
                            const day1 = "m";
                            const day2 = "tu";
                            const day3 = "w";
                            const day4 = "th";
                            const day5 = "f";
                            if ($.inArray(day1, item.days) != -1) {
                                days = days + day1.toUpperCase() + " ";
                            }
                            if ($.inArray(day2, item.days) != -1) {
                                days = days + day2.toUpperCase() + " ";
                            }
                            if ($.inArray(day3, item.days) != -1) {
                                days = days + day3.toUpperCase() + " ";
                            }
                            if ($.inArray(day4, item.days) != -1) {
                                days = days + day4.toUpperCase() + " ";
                            }
                            if ($.inArray(day5, item.days) != -1) {
                                days = days + day5.toUpperCase() + " ";
                            }

                            //get times
                            const start = item.start;
                            const end = item.end;
                            var start_min = Math.floor(start % 60);
                            if (start_min < 10) {
                                start_min = "0" + start_min;
                            }

                            var end_min = Math.floor(end % 60);
                            if (end_min < 10) {
                                end_min = "0" + end_min;
                            }

                            var start = Math.floor(start / 60) + ":" + start_min;
                            var end = Math.floor(end / 60) + ":" + end_min;
                            const time = start + "-" + end;

                            result = result + days + ": " + time + "<br>";
                        };

                        if (result) {
                            return new Spacebars.SafeString(result);
                        } else {
                            return "TBA";
                        };
                    }
                }, {
                    key: "",
                    label: "",
                    sortable: false,
                    fn: function(key, obj) {
                        if(dict.get("sectionDelete" + obj.id)){
                        	return new Spacebars.SafeString("<div class=\"ui active inline loader\"></div>");
                        } else {
                        	return new Spacebars.SafeString("<i class=\"remove icon js-remove-section\"></i>");
                        }
                    }
                }
            ],
        };
    },

    dataReady: function() {
        return Template.instance().wishlistDict.get("dataReady");
    },

    wishlistData: function() {
        return Template.instance().wishlistDict.get("wishlistData");
    },

    wishlist: function() {
        const wishlist = UserProfilePnc.findOne().wishlist;
        const dict = Template.instance().wishlistDict;

        Meteor.call("fetchSections", wishlist, function(err, result) {
            if (err) {
                window.alert(err.message);
                return;
            }

            const sorted_result = result.sort(function(a, b) {
                //for a
                let course_num_a = parseInt(a.code.match(/\d+/gi)[0]);
                if (course_num_a < 10) course_num_a = "00" + course_num_a;
                if (course_num_a >= 10 && course_num_a < 100) course_num_a = "0" + course_num_a;
                const course_dep_a = a.code.substring(0, a.code.indexOf(" "));
                const last_a = a.code.charAt(a.code.length - 1);
                let comp_string_a;
                if (/\w/i.test(last_a)) {
                    comp_string_a = course_num_a + last_a;
                } else {
                    comp_string_a = course_num_a + "0";
                };

                //for b
                let course_num_b = parseInt(b.code.match(/\d+/gi)[0]);
                if (course_num_b < 10) course_num_b = "00" + course_num_b;
                if (course_num_b >= 10 && course_num_b < 100) course_num_b = "0" + course_num_b;
                const course_dep_b = b.code.substring(0, b.code.indexOf(" "));
                const last_b = b.code.charAt(b.code.length - 1);
                let comp_string_b;
                if (/\w/i.test(last_b)) {
                    comp_string_b = course_num_b + last_b;
                } else {
                    comp_string_b = course_num_b + "0";
                };

                if (parseInt(a.term) < parseInt(b.term)) {
                    return 1;
                } else if (parseInt(a.term) > parseInt(b.term)) {
                    return -1;
                } else {
                    const major_comp = course_dep_a.localeCompare(course_dep_b);
                    if (major_comp != 0) {
                        return major_comp;
                    } else {
                        return comp_string_a.localeCompare(comp_string_b);
                    }
                }
            });
            for (let i = 0; i < sorted_result.length; i++) {
                sorted_result[i].index = i;
            };

            dict.set('wishlistData', sorted_result);
            dict.set("dataReady", true);
        })
    },
})

Template.wishlist.events({
	"click .js-wishlist-table tbody tr": function(event){
		if(event.target.nodeName === "I"){
			const dict = Template.instance().wishlistDict;
			dict.set("sectionDelete" + this.id, true);
			const section_id = this.id;
			Meteor.call("remove_wishlist_section", section_id, function(err, result){
				if(err){
					window.alert(err.message);
                    return;
				}

				dict.set("dataReady", false);
			})
		}
	},
})

Template.section_detail.onRendered(function() {
    $('.ui.accordion').accordion();
})

Template.section_detail.helpers({
    showDescription: function(text) {
        if (text.length > 50) {
            return text.substring(0, 50) + "...";
        } else {
            return text;
        };
    },
})
