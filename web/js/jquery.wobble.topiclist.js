"use strict";

function jQueryTopicsView () {
	this.e = $('<div></div>').addClass('widget').attr('id', 'topics_wrapper').appendTo('#widgets');
	
	this.jTopicsWrapper = this.e.append('<div id="topics_actions"></div>' + 
						'<ul id="topics">' + 
						'  <li>Loading ...</li>' + 
						'</ul>');
						
	this.$topics = $("#topics");
	
	this.$topicsAction = $("#topics_actions", this.e);
	
	var that = this;
	$("<button>New</button>").click(function() {
		that.onCreateNewTopic();
	}).appendTo(this.$topicsAction);
};
jQueryTopicsView.prototype = new TopicsListDisplay;
jQueryTopicsView.prototype.constructor = jQueryTopicsView;

// Methods --------------------------------------------------------
jQueryTopicsView.prototype.setActiveTopic = function(topic) {
	$(">li.active", this.$topics).removeClass("active");
	$("#topic-" + topic.id).addClass("active");
};
jQueryTopicsView.prototype.renderTopics = function(topics, prepend) {
	// Update document title
	var user = API.user();
	if (user && topics) {
		var unreadTopics = jQuery.grep(topics, function(topic) {
			return topic.post_count_unread > 0;
		}).length;
		if ( unreadTopics == 0 ) {
			document.title = user.name + " - Wobble";
		} else {
			document.title = "(" + unreadTopics + ") " + user.name + " - Wobble";
		}
	}

	// Render to html list
	for (var i = 0; i < topics.length; ++i) {
		this.renderTopic(topics[i], prepend);
	}
};
jQueryTopicsView.prototype.renderTopic = function(topic, prepend) {
	var template = '<li id="{{id}}" class="topic_header">' + 
				   ' <div class="abstract"></div>' + 
				   (topic.post_count_unread == 0 ?
				   		' <div class="messages">{{total}} msgs</div>' :
				   		' <div class="messages"><div class=unread>{{unread}}</div> of {{total}}</div>') 
				   	+
				   ' <div class="time">{{time}}</div>' + 
				   ' <div class="users">{{#users}}<img title="{{name}}" src="http://gravatar.com/avatar/{{img}}?s=32" width="32" height="32">{{/users}}</div>' + 
				   '</li>';
	var that = this;
	var $li = $(Mustache.to_html(template, {
		'id': 'topic-' + topic.id,
		'users': topic.readers.slice(0,3) /* Make sure we only have 3 users */,
		'unread': topic.post_count_unread,
		'total': topic.post_count_total,
		'time': this.renderTopicTimestamp(topic.max_last_touch)
	})).data('topic', topic);

	$li.on('click', function() {
		var topic = $(this).data('topic');
		if (topic) {
			that.onTopicClicked(topic);
		}
	});

	var abstract = $(".abstract", $li).html(topic.abstract);

	if ( topic.post_count_unread > 0) {
		abstract.css('font-weight', 'bold');
	}
	
	if ( prepend ) {
		$li.prependTo(this.$topics);
	} else {
		$li.appendTo(this.$topics)
	}
};
jQueryTopicsView.prototype.renderTopicTimestamp = function(timestamp) {
	if (!timestamp) {
		return "";
	}
	// NOTE: This format the date in the german way (localized): dd.mm.yyyy hh24:mi
	var createdAt = new Date(timestamp * 1000), now = new Date();
	var hours = createdAt.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	var minutes = createdAt.getMinutes();
	if ( minutes < 10) {
		minutes = "0" + minutes;
	}
	var time = hours + ":" + minutes;

	var month = createdAt.getMonth() + 1;
	if ( month < 0 ){
		month = "0" + month;
	}
	
	if ( createdAt.getYear() == now.getYear() ) {
		if ( createdAt.getMonth() == now.getMonth() &&
		     createdAt.getDate() == now.getDate()) { // This post is from today, only show the time
			return time;
		} else {
			// this post is at least from this year, show day + month
			return createdAt.getDate() + "." + month + ".";
		}
	} else {
		return createdAt.getDate() + "." + month + "."+ (1900 + createdAt.getYear());
	}
};
jQueryTopicsView.prototype.clear = function() {
	this.$topics.empty();
};
