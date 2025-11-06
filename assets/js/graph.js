// assets/js/graph.js
document.addEventListener("DOMContentLoaded", () => {
  const svg = d3.select("#depGraph");
  const width = 1000;
  const height = 600;

  svg.attr("viewBox", [0, 0, width, height])
     .style("cursor", "grab");

  const tooltip = d3.select("#gTooltip");

  // Logical infra flow (right → left)
  const nodes = [
    { id: "Client", level: 8 },
    { id: "Ansible", level: 7 },
    { id: "DNS", level: 7 },
    { id: "Terraform", level: 7 },
    { id: "Cloud", level: 6 },
    { id: "Firewall", level: 5 },
    { id: "Load Balancer", level: 4 },
    { id: "Kubernetes", level: 3 },
    { id: "CI/CD", level: 3 },
    { id: "App", level: 2 },
    { id: "Database", level: 1 },
    { id: "Metrics", level: 1 },
    { id: "Logs", level: 1 },
    { id: "Traces", level: 1 },
    { id: "Cloud Services", level: 1 },
    { id: "Visualize", level: 0 }
  ];

  // Flow reversed (right → left)
  const links = [
    { source: "DNS", target: "Client" },
    { source: "Cloud", target: "DNS" },
    { source: "Firewall", target: "Cloud" },
    { source: "Load Balancer", target: "Firewall" },
    { source: "Kubernetes", target: "Load Balancer" },
    { source: "Kubernetes", target: "CI/CD" },
    { source: "App", target: "Kubernetes" },
    { source: "Database", target: "App" },
    { source: "Metrics", target: "App" },
    { source: "Logs", target: "App" },
    { source: "Traces", target: "App" },
    { source: "Cloud Services", target: "App" },
    { source: "Cloud", target: "Terraform" },
    { source: "Cloud", target: "Ansible" },
    { source: "Visualize", target: "Metrics" },
    { source: "Visualize", target: "Logs" },
    { source: "Visualize", target: "Traces" }
  ];

  // Arrange levels horizontally (right → left)
  const levelGap = 100;
  const nodesByLevel = d3.group(nodes, d => d.level);
  let xOffset = width - 120;

  nodesByLevel.forEach((group, level) => {
    const yCenter = height / 2;
    const spacing = 70;
    const totalHeight = (group.length - 1) * spacing;
    group.forEach((node, i) => {
      node.x = xOffset;
      node.y = yCenter - totalHeight / 2 + i * spacing;
    });
    xOffset -= levelGap;
  });

  // Dotted animated lines
  const link = svg.append("g")
    .attr("stroke", "#aaa")
    .attr("stroke-width", 2)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-dasharray", "4,8")
    .attr("opacity", 0.8);

  function animateLinks() {
    link.attr("stroke-dashoffset", (_, i) => (Date.now() / 40 + i * 20) % 20);
    requestAnimationFrame(animateLinks);
  }
  animateLinks();

  // Node circles
  const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 16)
    .attr("fill", "#F87B1B")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`<strong>${d.id}</strong>`);
      tooltip.style("left", (event.pageX + 10) + "px")
             .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0))
    .on("mouseenter", function () {
      d3.select(this).transition().attr("r", 22);
    })
    .on("mouseleave", function () {
      d3.select(this).transition().attr("r", 16);
    });

  // Labels under circles
  svg.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y + 35)
    .attr("fill", "#ddd")
    .attr("font-size", "11px")
    .attr("text-anchor", "middle")
    .text(d => d.id);

  // Static positions
  link
    .attr("x1", d => nodes.find(n => n.id === d.source).x)
    .attr("y1", d => nodes.find(n => n.id === d.source).y)
    .attr("x2", d => nodes.find(n => n.id === d.target).x)
    .attr("y2", d => nodes.find(n => n.id === d.target).y);
});
