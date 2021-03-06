// Server side
if (Meteor.isServer) {
    // Collection schema : 
    // project : {
    // 		name: '',
    // 		description: '',
    // 		url: '',
    // 		authors: [_id, _id],
    //		likes: int,
    //		photos: 'photo.png'
    // }

    if (Projects.find().count() == 0)
        Projects.insert({
            name: 'Meteor-France',
            description: 'Site actuel',
            url: 'france.meteor.com',
            authors: ['Bob'],
            likes: 0,
            photos: ''
        });

    Meteor.methods({
        like: function(id) {
            var user = Meteor.user();
            if (user) {
                if (Votes.find({
                    voted: user._id
                }).count() == 0) {
                    // var success = Projects.update({
                    //     _id: id
                    // }, {
                    //     $inc: {
                    //         likes: 1
                    //     }
                    // });
                    console.log(user._id);
                    return 1;
                    // return success.error == null;
                } else {
                    return 'Un seul vote suffit !';
                }
            } else
                return 'Vous ne pouvez pas voter car vous n\'êtes pas connecté';
        },
    });

    Meteor.publish('projects', function() {
        return Projects.find();
    });
}

// Client side
if (Meteor.isClient) {
    Meteor.subscribe('projects');

    Template.projectBoard.events({
        'click .like': function(e) {
            Meteor.call('like', function(err, res) {
                if (res) {
                    if (typeof res == String)
                        alertMessage('.alert-success', 'A voté !');
                    else
                        alertMessage('.alert-warning', res);
                } else
                    alertMessage('.alert-error', 'Une erreur est survenue, désolé !');
            });
        }
    })
}

// Handlebars
alertMessage = function(type, log) {
    $(type).empty();
    $(type).append(log);
    Meteor.setTimeout(function() {
        $(type).empty();
    }, 5000);
};