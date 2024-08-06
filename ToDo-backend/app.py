from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests from your React app

tasks = [
    {"id": 1, "task": "Sample Task 1", "color": "#ff0000"},
    {"id": 2, "task": "Sample Task 2", "color": "#00ff00"}
]

@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    new_task = request.json.get('task')
    new_color = request.json.get('color', '#000000')
    if new_task:
        new_id = max(task['id'] for task in tasks) + 1 if tasks else 1
        task = {"id": new_id, "task": new_task, "color": new_color}
        tasks.append(task)
        return jsonify(task), 201
    return jsonify({"error": "Task content is missing"}), 400

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    new_task = request.json.get('task')
    new_color = request.json.get('color', '#000000')
    for task in tasks:
        if task['id'] == id:
            task['task'] = new_task
            task['color'] = new_color
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task['id'] != id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
