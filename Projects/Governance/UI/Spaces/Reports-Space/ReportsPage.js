function newGovernanceReportsReportsPage() {
    let thisObject = {
        render: render,
        initialize: initialize,
        finalize: finalize
    }

    return thisObject

    function initialize() {

    }

    function finalize() {

    }

    function render() {

        let resultsArary = []
        let initialTime = new Date()
        buildHTML()

        function buildHTML() {
            const tabs = ['All', 'Nodes', 'Concepts', 'Topics', 'Tutorials', 'Reviews', 'Books', 'Workspace']
            let HTML = ''
            HTML = HTML + '<section id="governance-search-results-div" class="governance-search-page-container">'
            HTML = HTML + UI.projects.education.spaces.docsSpace.mainSearchPage.addSearchHeader()

            // Tabs
            HTML = HTML + '<div class="governance-search-results-header-tabs-container">'
            let checked = ' checked=""'
            for (let i = 0; i < tabs.length; i++) {
                let tab = tabs[i]
                HTML = HTML + '<input id="tab' + (i + 1) + '" type="radio" name="tabs"' + checked + '><label for="tab' + (i + 1) + '">' + tab + '</label>'
                checked = ''
            }

            // Results
            HTML = HTML + '<div class="governance-search-result-content">'

            let totalResults = new Map()
            for (let i = 0; i < tabs.length; i++) {
                let tab = tabs[i]
                HTML = HTML + '<div id="content' + (i + 1) + '">'
                HTML = HTML + '<p> ' + tab.toUpperCase() + '_TOTAL_RESULTS results (' + tab.toUpperCase() + '_TOTAL_SECONDS seconds)</p>'

                let resultCounter = 0
                for (let j = 0; j < resultsArary.length; j++) {
                    let result = resultsArary[j]

                    if (tab !== 'All') {
                        if (tab.indexOf(result.documentIndex.category) < 0) {
                            continue
                        }
                    }
                    resultCounter++

                    /* Lets see if we can show a path */
                    let path = ''
                    if (result.documentIndex.docsSchemaDocument.nodeNameTypePath !== undefined) {
                        let linkLabel
                        for (let i = 0; i < result.documentIndex.docsSchemaDocument.nodeNameTypePath.length; i++) {
                            let pathStep = result.documentIndex.docsSchemaDocument.nodeNameTypePath[i]
                            let nodeName = pathStep[0]
                            let nodeType = pathStep[1]
                            let nodeProject = pathStep[2]
                            let nodeId = pathStep[3]
                            let link = ' > <a onClick="UI.projects.education.spaces.docsSpace.navigateTo(\'' + nodeProject + '\', \'' + result.documentIndex.category + '\', \'' + nodeType.replace(/'/g, 'AMPERSAND') + '\', ' + undefined + '  ,\'' + nodeId + '\')"  class="governance-search-result-content-record-project-category-link">'
                            if (nodeName === 'New ' + nodeType || nodeName === 'My ' + nodeType || nodeName === undefined) {
                                nodeName = ''
                            }
                            if (nodeName === '') {
                                linkLabel = nodeType
                            } else {
                                linkLabel = nodeType + ' (' + nodeName + ')'
                            }
                            path = path + link + linkLabel + '</a>'
                        }
                    }

                    HTML = HTML + '<div class="governance-search-result-content-record-container">'
                    HTML = HTML + '<p class="governance-search-result-content-record-project-category">' + result.documentIndex.project + ' > ' + result.documentIndex.category + path + '</p>'

                    let mainLink = ''

                    switch (result.documentIndex.category) {
                        case 'Topic': {
                            HTML = HTML + '<p class="governance-search-result-content-record-topic">' + result.documentIndex.docsSchemaDocument.topic + ' - Page ' + result.documentIndex.docsSchemaDocument.pageNumber + '</p>'
                            mainLink = result.documentIndex.docsSchemaDocument.type
                            break
                        }
                        case 'Tutorial': {
                            HTML = HTML + '<p class="governance-search-result-content-record-tutorial">' + result.documentIndex.docsSchemaDocument.tutorial + ' - Page ' + result.documentIndex.docsSchemaDocument.pageNumber + '</p>'
                            mainLink = result.documentIndex.docsSchemaDocument.type
                            break
                        }
                        case 'Review': {
                            HTML = HTML + '<p class="governance-search-result-content-record-review">' + result.documentIndex.docsSchemaDocument.review + ' - Page ' + result.documentIndex.docsSchemaDocument.pageNumber + '</p>'
                            mainLink = result.documentIndex.docsSchemaDocument.type
                            break
                        }
                        default: {
                            mainLink = result.documentIndex.docsSchemaDocument.type
                        }
                    }
                    HTML = HTML + '<p><a onClick="UI.projects.education.spaces.docsSpace.navigateTo(\'' + result.documentIndex.project + '\', \'' + result.documentIndex.category + '\', \'' + result.documentIndex.docsSchemaDocument.type.replace(/'/g, 'AMPERSAND') + '\', ' + undefined + '  ,\'' + result.documentIndex.docsSchemaDocument.nodeId + '\')" class="governance-search-result-content-record-title">' + mainLink + '</a></p>'

                    if (result.documentIndex.docsSchemaDocument.definition !== undefined) {
                        HTML = HTML + '<p class="governance-search-result-content-record-extract">' + UI.projects.education.utilities.docs.getTextBasedOnLanguage(result.documentIndex.docsSchemaDocument.definition) + '</p>'
                    } else {
                        HTML = HTML + '<p class="governance-search-result-content-record-extract">' + 'No definition available.' + '</p>'
                    }
                    HTML = HTML + '</div>'
                }
                HTML = HTML + '</div>'
                totalResults.set(tab, resultCounter)
            }

            // End Content
            HTML = HTML + '</div>'
            HTML = HTML + '</div>'

            // End Section
            HTML = HTML + '</section>'

            // Total Seconds Calculation
            let finalTime = new Date()
            let totalSeconds = ((finalTime.valueOf() - initialTime.valueOf()) / 1000).toFixed(3)
            for (let i = 0; i < tabs.length; i++) {
                let tab = tabs[i]
                HTML = HTML.replace(tab.toUpperCase() + '_TOTAL_SECONDS', totalSeconds)
                resultCounter = totalResults.get(tab)
                HTML = HTML.replace(tab.toUpperCase() + '_TOTAL_RESULTS', resultCounter)
            }

            let docsContentDiv = document.getElementById('governance-content-div')
            docsContentDiv.innerHTML = HTML + UI.projects.education.spaces.docsSpace.footer.addFooter()

            UI.projects.education.spaces.docsSpace.mainSearchPage.detectEnterOnSearchBox()
            UI.projects.education.spaces.docsSpace.mainSearchPage.setFocusOnSearchBox()
        }
    }
}