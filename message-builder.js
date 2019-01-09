const assets = require("./assets");

module.exports = {
    supportedEvents: [
        "jira:issue_updated",
        "jira:issue_created"
    ],
    handleEvent(dataItem, config) {
        // check if event is supported
        let isEventSupported = module.exports.supportedEvents.find((event) => event === dataItem.webhookEvent);

        if (isEventSupported) {
            // get issue key
            let issueKey = dataItem.issue.key;
            if (issueKey) {
                let projectTag = issueKey.match(/^([A-Z]*[0-9]*)*/g)[0];
                let project = config.jira.projects.find((project) => project.name === projectTag);
                return {
                    notification: module.exports.buildNotification(dataItem, config),
                    project: project
                };
            }
        }

        return null;
    },
    buildNotification(dataItem, config) {
        // get color by status
        let color = module.exports.getColorByStatus(dataItem.issue.fields.status.name);

        // get icon by issue type
        let icon = module.exports.getIconByIssueType(dataItem.issue.fields.issuetype.name, assets);

        // prepare changes description
        let changes = module.exports.prepareChanges(dataItem);

        // build message
        let message = {
            embed: {
                author: {
                    name: dataItem.issue.fields.issuetype.name,
                    icon_url: icon
                },
                color: color,
                title: `${dataItem.issue.key} ${dataItem.issue.fields.summary}`,
                url: `${config.jira.url}/browse/${dataItem.issue.key}`,
                fields: changes,
                timestamp: new Date(dataItem.timestamp),
                footer: {
                    icon_url: dataItem.user.avatarUrls["16x16"],
                    text: dataItem.user.displayName
                }
            }
        };

        return message;
    },
    getColorByStatus(statusName) {
        if (statusName.toLowerCase() === "in progress") {
            return 16765777;
        }

        if (statusName.toLowerCase() === "done") {
            return 1345836;
        }

        if (statusName.toLowerCase() === "to do") {
            return 4876165;
        }

        return 3447003;
    },
    getIconByIssueType(issueType, assets) {
        if (issueType === "Support") {
            return assets.jiraSupport;
        }
        
        if (issueType === "Story") {
            return assets.jiraStory;
        }

        if (issueType === "Bug") {
            return assets.jiraBug;
        }

        if (issueType === "Task" && issueType === "Sub-task") {
            return assets.jiraTask;
        }

        return assets.jiraTask;
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    prepareChanges(dataItem) {
        let changes = [];
        let oneliners = "";

        if (dataItem.changelog) {
            dataItem.changelog.items.forEach(function (change) {
                let from = change.fromString === null
                    ? ""
                    : change.fromString;
                let arrow = change.toString === null
                    ? ""
                    : "->";
                let to = change.toString === null
                    ? ""
                    : change.toString;

                if (change.field === "description") {
                    let shortDescription = to.slice(0, 200);
                    shortDescription += "...";

                    changes.push({
                        name: module.exports.capitalizeFirstLetter(change.field),
                        value: shortDescription
                    });
                } else {
                    oneliners += `**${module.exports.capitalizeFirstLetter(change.field)}**: ${from} ${arrow} ${to}`;
                }
            });

            changes.push({
                name: "Changes",
                value: oneliners
            });
        }
        return changes;
    }
}